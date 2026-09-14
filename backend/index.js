require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const authRoutes = require("./routes/auth");
const authMiddleware = authRoutes.authMiddleware;
const fundsRoutes = require("./routes/funds");
const watchlistRoutes = require("./routes/watchlists");
const { InstrumentModel } = require("./models/InstrumentModel");
const { TradeModel } = require("./models/TradeModel");
const { applyFill, squareOff, convertProduct, receiveTransfer } = require("./services/positionService");
const { evaluateFill, settleFill, releaseBlock, releasePositionMargin, marginFor, cashNeededPaise } = require("./services/matchingService");
const { addEntry, getFunds } = require("./services/fundsService");
const { isMarketOpen } = require("./services/marketHours");
const { initPriceSocket, getLatestPrice } = require("./sockets/priceSocket");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
const server = http.createServer(app); // socket.io needs the raw http server, not just express

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/funds", fundsRoutes);
app.use("/watchlists", watchlistRoutes);

app.get("/", (req, res) => res.send("working"));

// Phase 0: instrument master (search + watchlist source in Phase 1)
app.get("/instruments", authMiddleware, async (req, res) => {
  const q = (req.query.search || "").toUpperCase();
  const filter = { active: true };
  if (q) filter.symbol = new RegExp("^" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (req.query.segment) filter.segment = req.query.segment;
  const rows = await InstrumentModel.find(filter).sort({ symbol: 1 }).limit(50);
  res.json(rows);
});

// Phase 0: every data query is scoped to the logged-in user. Rows written
// before Phase 0 carry no userMobile and are therefore invisible.
app.get("/allHoldings", authMiddleware, async (req, res) => {
  const allHoldings = await HoldingsModel.find({ userMobile: req.user.mobile });
  res.json(allHoldings);
});

app.get("/allPositions", authMiddleware, async (req, res) => {
  const allPositions = await PositionsModel.find({ userMobile: req.user.mobile });
  res.json(allPositions);
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  const allOrders = await OrdersModel.find({ userMobile: req.user.mobile })
    .sort({ _id: -1 })
    .limit(100);
  res.json(allOrders);
});

// Phase 2+3 order entry: MARKET fills now; LIMIT/SL/SLM rest OPEN until a
// tick touches them; IOC cancels if unfillable at entry; AMO queues while
// the market is shut. MIS/NRML block margin; CNC BUY needs full cash.
app.post("/newOrder", authMiddleware, async (req, res) => {
  const { name, qty, mode, product = "CNC", orderType = "MARKET", validity = "DAY", limitPrice, triggerPrice, price } = req.body;

  if (!name || !qty || !mode) {
    return res.status(400).send("name, qty, and mode are required");
  }
  if (!["BUY", "SELL"].includes(mode)) return res.status(400).send("mode must be BUY or SELL");
  if (!["CNC", "MIS", "NRML"].includes(product)) return res.status(400).send("product must be CNC, MIS or NRML");
  if (!["MARKET", "LIMIT", "SL", "SLM"].includes(orderType)) return res.status(400).send("bad orderType");
  if (!["DAY", "IOC", "AMO"].includes(validity)) return res.status(400).send("bad validity");
  const userMobile = req.user.mobile;
  const orderQty = Number(qty);
  if (!Number.isFinite(orderQty) || orderQty <= 0) return res.status(400).send("qty must be > 0");
  if ((orderType === "LIMIT" || orderType === "SL") && !(Number(limitPrice) > 0)) {
    return res.status(400).send("limitPrice required for LIMIT/SL");
  }
  if ((orderType === "SL" || orderType === "SLM") && !(Number(triggerPrice) > 0)) {
    return res.status(400).send("triggerPrice required for SL/SLM");
  }

  const inst = await InstrumentModel.findOne({ symbol: name, active: true });
  if (!inst) return res.status(404).send("unknown instrument");
  if (inst.segment === "FO") {
    if (product === "CNC") return res.status(400).send("F&O needs MIS or NRML product");
    if (orderQty % inst.lotSize !== 0) return res.status(400).send(`qty must be a multiple of lot size ${inst.lotSize}`);
    if (inst.expiry && inst.expiry.toDateString() === new Date().toDateString()) {
      return res.status(400).send("expiry-day new positions blocked — square off only");
    }
  }
  if (product === "CNC" && mode === "SELL") {
    const existing = await HoldingsModel.findOne({ userMobile, name });
    if (!existing || existing.qty < orderQty) return res.status(400).send("Insufficient holdings to sell");
  }

  const live = getLatestPrice(name);
  const refPrice = live ? live.price : Number(price) || Number(limitPrice) || 0;
  if (!(refPrice > 0) && orderType === "MARKET") {
    return res.status(400).send("no live price yet — retry in a few seconds");
  }

  // RMS: margin block (MIS/NRML) + full-cash check (CNC BUY).
  const { availablePaise } = await getFunds(userMobile);
  const needMargin = marginFor(product, orderQty, refPrice || Number(limitPrice) || 0);
  const needCash = cashNeededPaise(product, mode, orderQty, refPrice || Number(limitPrice) || 0);
  if (needMargin + needCash > availablePaise) return res.status(400).send("Insufficient margin");

  const order = new OrdersModel({
    userMobile, name, qty: orderQty, price: refPrice, mode, product,
    orderType, validity, limitPrice: limitPrice ? Number(limitPrice) : undefined,
    triggerPrice: triggerPrice ? Number(triggerPrice) : undefined,
    status: validity === "AMO" && !isMarketOpen() ? "PENDING" : "OPEN",
  });
  if (needMargin > 0) {
    await addEntry(userMobile, "MARGIN_BLOCK", -needMargin, { ref: String(order._id), note: `${product} ${name} x${orderQty}` });
    order.blockedPaise = needMargin;
  }
  await order.save();

  if (order.status === "PENDING") return res.json({ success: true, status: "PENDING", product, orderType });

  // Immediate evaluation at entry (also settles MARKET on the spot).
  const quote = live ? { price: live.price } : null;
  if (quote || orderType === "MARKET") {
    const { fill, price: fillPrice } = evaluateFill(order, { price: quote ? quote.price : refPrice });
    if (fill) {
      const r = await settleFill(userMobile, order, fillPrice);
      if (!r.filled) return res.status(400).send(r.reason);
      return res.json({ success: true, execPrice: fillPrice, product, orderType, status: "COMPLETE" });
    }
  }
  if (validity === "IOC") {
    order.status = "CANCELLED";
    await releaseBlock(order);
    await order.save();
    return res.json({ success: true, status: "CANCELLED", note: "IOC: no immediate fill", product, orderType });
  }
  return res.json({ success: true, status: "OPEN", product, orderType, orderId: order._id });
});

// Modify an OPEN/PENDING order's limit/trigger/qty (re-checks margin delta).
app.put("/orders/:id", authMiddleware, async (req, res) => {
  const order = await OrdersModel.findOne({ _id: req.params.id, userMobile: req.user.mobile });
  if (!order) return res.status(404).send("not found");
  if (!["OPEN", "PENDING"].includes(order.status)) return res.status(400).send("only OPEN/PENDING orders can be modified");
  const { limitPrice, triggerPrice, qty } = req.body;
  if (qty !== undefined) {
    const q = Number(qty);
    if (!Number.isFinite(q) || q <= 0) return res.status(400).send("bad qty");
    const live = getLatestPrice(order.name);
    const ref = live ? live.price : order.limitPrice || order.price;
    // Margin block and CNC cash are separate pots — track deltas independently.
    const marginDelta = marginFor(order.product, q, ref) - order.blockedPaise;
    const cashDelta =
      cashNeededPaise(order.product, order.mode, q, ref) -
      cashNeededPaise(order.product, order.mode, order.qty, ref);
    const { availablePaise } = await getFunds(req.user.mobile);
    if (marginDelta + cashDelta > availablePaise) return res.status(400).send("Insufficient margin for modification");
    if (marginDelta !== 0) {
      await addEntry(req.user.mobile, marginDelta > 0 ? "MARGIN_BLOCK" : "MARGIN_RELEASE", -marginDelta, { ref: String(order._id) });
      order.blockedPaise = Math.max(0, order.blockedPaise + marginDelta);
    }
    order.qty = q;
  }
  if (limitPrice !== undefined) order.limitPrice = Number(limitPrice);
  if (triggerPrice !== undefined) order.triggerPrice = Number(triggerPrice);
  order.updatedAt = new Date();
  await order.save();
  res.json(order);
});

// Cancel an OPEN/PENDING order (releases its margin block).
app.post("/orders/:id/cancel", authMiddleware, async (req, res) => {
  const order = await OrdersModel.findOne({ _id: req.params.id, userMobile: req.user.mobile });
  if (!order) return res.status(404).send("not found");
  if (!["OPEN", "PENDING"].includes(order.status)) return res.status(400).send("only OPEN/PENDING orders can be cancelled");
  order.status = "CANCELLED";
  await releaseBlock(order);
  order.updatedAt = new Date();
  await order.save();
  res.json({ ok: true });
});

// Square off one position at live (or last-known) price.
app.post("/positions/squareoff", authMiddleware, async (req, res) => {
  const { name, product = "MIS" } = req.body;
  if (!name) return res.status(400).send("name is required");
  const live = getLatestPrice(name);
  const pos = await PositionsModel.findOne({ userMobile: req.user.mobile, name, product });
  if (!pos) return res.status(404).send("no such position");
  const price = live ? live.price : pos.price;
  if (!(price > 0)) return res.status(400).send("no price available");
  const r = await squareOff(req.user.mobile, name, product, price);
  await releasePositionMargin(req.user.mobile, name, product); // free MIS/NRML blocks
  res.json(r);
});

// Convert between products. MIS->CNC delivers into holdings at cost;
// CNC->MIS moves delivery into intraday. Transfer, not a trade (no P&L).
app.post("/positions/convert", authMiddleware, async (req, res) => {
  const { name, from = "MIS", to = "CNC", qty } = req.body;
  if (!name) return res.status(400).send("name is required");
  if (from === to) return res.status(400).send("from and to differ");
  const userMobile = req.user.mobile;
  try {
    if (from === "CNC") {
      const holding = await HoldingsModel.findOne({ userMobile, name });
      if (!holding) return res.status(404).send("no such holding");
      const moveQty = qty ? Number(qty) : holding.qty;
      if (!(moveQty > 0) || holding.qty < moveQty) return res.status(400).send("insufficient holding qty");
      holding.qty -= moveQty;
      if (holding.qty === 0) await HoldingsModel.deleteOne({ userMobile, name });
      else await holding.save();
      const live = getLatestPrice(name);
      await TradeModel.create({ userMobile, symbol: name, product: "CNC", mode: "SELL", qty: moveQty, price: live ? live.price : holding.avg, note: "CONVERT" });
      await receiveTransfer(userMobile, name, to, moveQty, holding.avg, live ? live.price : holding.avg);
      return res.json({ ok: true, qty: moveQty, avg: holding.avg });
    }
    // from MIS/NRML
    const pos = await PositionsModel.findOne({ userMobile, name, product: from });
    if (!pos) return res.status(404).send("no such position");
    const moveQty = qty ? Number(qty) : Math.abs(pos.qty);
    const { avg } = await convertProduct(userMobile, name, from, to, moveQty);
    const stillOpen = await PositionsModel.findOne({ userMobile, name, product: from });
    if (!stillOpen) await releasePositionMargin(userMobile, name, from);
    if (to === "CNC") {
      const existing = await HoldingsModel.findOne({ userMobile, name });
      if (existing) {
        const newQty = existing.qty + moveQty;
        existing.avg = (existing.avg * existing.qty + avg * moveQty) / newQty;
        existing.qty = newQty;
        await existing.save();
      } else {
        await HoldingsModel.create({ userMobile, name, qty: moveQty, avg, price: avg, net: "0.00%", day: "0.00%" });
      }
      await TradeModel.create({ userMobile, symbol: name, product: "CNC", mode: "BUY", qty: moveQty, price: avg, note: "CONVERT" });
    } else {
      const live = getLatestPrice(name);
      await receiveTransfer(userMobile, name, to, moveQty, avg, live ? live.price : avg);
    }
    res.json({ ok: true, qty: moveQty, avg });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Exit all intraday positions at live (or last-known) prices.
app.post("/positions/exit-all", authMiddleware, async (req, res) => {
  const userMobile = req.user.mobile;
  const open = await PositionsModel.find({ userMobile, product: { $in: ["MIS", "NRML"] } });
  let totalRealized = 0;
  let closed = 0;
  for (const p of open) {
    const live = getLatestPrice(p.name);
    const price = live ? live.price : p.price;
    if (!(price > 0)) continue;
    const r = await squareOff(userMobile, p.name, p.product, price);
    totalRealized += r.realized;
    if (r.closedQty > 0) {
      closed += 1;
      await releasePositionMargin(userMobile, p.name, p.product);
    }
  }
  res.json({ closed, totalRealized });
});

// Tradebook (CONVERT notes included; Phase 2 tradebook filters display).
app.get("/trades", authMiddleware, async (req, res) => {
  const trades = await TradeModel.find({ userMobile: req.user.mobile }).sort({ _id: -1 }).limit(100);
  res.json(trades);
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected");
    initPriceSocket(server); // attach socket.io to the same server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB connection error:", err));