// Phase 2 matching engine + RMS margining.
// Pure fill evaluation (unit-testable) + shared settlement used by both
// /newOrder (MARKET instant path) and the tick loop (LIMIT/SL/AMO).
const { OrdersModel } = require("../models/OrdersModel");
const { HoldingsModel } = require("../models/HoldingsModel");
const { TradeModel } = require("../models/TradeModel");
const { applyFill } = require("./positionService");
const { addEntry, getFunds } = require("./fundsService");
const { isMarketOpen } = require("./marketHours");

const MARGIN_PCT = { CNC: 1.0, MIS: 0.2, NRML: 0.12 }; // approx; not SPAN
const toPaise = (rupees) => Math.round(Number(rupees) * 100);

function marginFor(product, qty, price) {
  if (product === "CNC") return 0; // CNC SELL needs holdings, CNC BUY checked at fill
  return toPaise(qty * price * (MARGIN_PCT[product] ?? 1));
}

// CNC BUY needs full value available (checked at placement AND fill).
function cashNeededPaise(product, mode, qty, price) {
  if (product === "CNC" && mode === "BUY") return toPaise(qty * price);
  return 0;
}

// Pure: can this order fill at this quote? Returns { fill, price }.
function evaluateFill(order, quote) {
  const ltp = quote.price;
  const isBuy = order.mode === "BUY";
  switch (order.orderType) {
    case "MARKET":
      return { fill: true, price: ltp };
    case "LIMIT":
      if (order.limitPrice == null) return { fill: false };
      if (isBuy && ltp <= order.limitPrice) return { fill: true, price: Math.min(order.limitPrice, ltp) };
      if (!isBuy && ltp >= order.limitPrice) return { fill: true, price: Math.max(order.limitPrice, ltp) };
      return { fill: false };
    case "SL":
    case "SLM": {
      if (order.triggerPrice == null) return { fill: false };
      const triggered = isBuy ? ltp >= order.triggerPrice : ltp <= order.triggerPrice;
      if (!triggered) return { fill: false };
      if (order.orderType === "SL" && order.limitPrice != null) {
        // Stop-limit: after trigger, needs limit touch too.
        if (isBuy && ltp > order.limitPrice) return { fill: false };
        if (!isBuy && ltp < order.limitPrice) return { fill: false };
        return { fill: true, price: ltp };
      }
      return { fill: true, price: ltp }; // SLM: market after trigger
    }
    default:
      return { fill: false };
  }
}

async function releaseBlock(order) {
  if (!order.blockedPaise) return;
  await addEntry(order.userMobile, "MARGIN_RELEASE", order.blockedPaise, { ref: String(order._id) });
  order.blockedPaise = 0;
}

// Release margin held by filled MIS/NRML orders once the position is gone.
async function releasePositionMargin(userMobile, symbol, product) {
  const orders = await OrdersModel.find({ userMobile, name: symbol, product, status: "COMPLETE", blockedPaise: { $gt: 0 } });
  for (const o of orders) {
    await releaseBlock(o);
    await o.save();
  }
}

// Settle one fill: holdings/position + trade + cash + margin release.
// CNC SELL with vanished holdings → REJECTED (realistic late rejection).
async function settleFill(userMobile, order, execPrice) {
  const { name, qty, mode, product } = order;
  if (product === "CNC") {
    if (mode === "BUY") {
      const cost = toPaise(qty * execPrice);
      const { availablePaise } = await getFunds(userMobile);
      if (cost > availablePaise) {
        order.status = "REJECTED";
        await releaseBlock(order);
        await order.save();
        return { filled: false, reason: "Insufficient funds at fill" };
      }
      const existing = await HoldingsModel.findOne({ userMobile, name });
      if (existing) {
        const newQty = existing.qty + qty;
        existing.avg = (existing.avg * existing.qty + execPrice * qty) / newQty;
        existing.qty = newQty;
        existing.price = execPrice;
        await existing.save();
      } else {
        await HoldingsModel.create({ userMobile, name, qty, avg: execPrice, price: execPrice, net: "0.00%", day: "0.00%" });
      }
      await addEntry(userMobile, "TRADE_DEBIT", -cost, { ref: String(order._id), note: `BUY ${qty} ${name} @${execPrice}` });
    } else {
      const existing = await HoldingsModel.findOne({ userMobile, name });
      if (!existing || existing.qty < qty) {
        order.status = "REJECTED";
        await releaseBlock(order);
        await order.save();
        return { filled: false, reason: "Insufficient holdings at fill" };
      }
      existing.qty -= qty;
      if (existing.qty === 0) await HoldingsModel.deleteOne({ userMobile, name });
      else await existing.save();
      await addEntry(userMobile, "TRADE_CREDIT", toPaise(qty * execPrice), { ref: String(order._id), note: `SELL ${qty} ${name} @${execPrice}` });
    }
    await TradeModel.create({ userMobile, symbol: name, product, mode, qty, price: execPrice, orderRef: order._id });
  } else {
    await applyFill(userMobile, name, product, mode, qty, execPrice, { orderRef: order._id });
  }
  await releaseBlock(order);
  order.status = "COMPLETE";
  order.filledQty = qty;
  order.updatedAt = new Date();
  await order.save();
  return { filled: true, execPrice };
}

// Tick-loop hook: fill OPEN orders with fresh quotes; activate due AMOs.
// Returns dirty userMobiles for the ordersChanged broadcast.
async function checkOpenOrders(quotes) {
  const symbols = Object.keys(quotes);
  if (!symbols.length) return [];
  const open = await OrdersModel.find({ name: { $in: symbols }, status: { $in: ["OPEN", "PENDING"] } });
  const dirty = new Set();
  const marketOpen = isMarketOpen();
  for (const order of open) {
    if (order.status === "PENDING") {
      if (order.validity === "AMO" && marketOpen) {
        order.status = "OPEN";
        await order.save();
      } else continue;
    }
    const quote = quotes[order.name];
    if (!quote) continue;
    const { fill, price } = evaluateFill(order, quote);
    if (!fill) continue;
    const r = await settleFill(order.userMobile, order, price);
    if (r.filled) dirty.add(order.userMobile);
    else dirty.add(order.userMobile); // rejections also refresh UI
  }
  return [...dirty];
}

module.exports = {
  evaluateFill,
  settleFill,
  checkOpenOrders,
  releaseBlock,
  releasePositionMargin,
  marginFor,
  cashNeededPaise,
};
