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
const { initPriceSocket, getLatestPrice } = require("./sockets/priceSocket");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
const server = http.createServer(app); // socket.io needs the raw http server, not just express

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("working"));

app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// renamed from /newOrders → /newOrder to match what BuyActionWindow.js actually calls
app.post("/newOrder", async (req, res) => {
  const { name, qty, mode } = req.body;

  if (!name || !qty || !mode) {
    return res.status(400).send("name, qty, and mode are required");
  }

  const live = getLatestPrice(name);
  const execPrice = live ? live.price : Number(req.body.price) || 0; // fall back to submitted price if live feed hasn't ticked yet

  const newOrder = new OrdersModel({ name, qty, price: execPrice, mode });
  await newOrder.save();

  if (mode === "BUY") {
    const existing = await HoldingsModel.findOne({ name });
    if (existing) {
      const newQty = existing.qty + Number(qty);
      existing.avg = (existing.avg * existing.qty + execPrice * qty) / newQty;
      existing.qty = newQty;
      existing.price = execPrice;
      await existing.save();
    } else {
      await HoldingsModel.create({
        name,
        qty: Number(qty),
        avg: execPrice,
        price: execPrice,
        net: "0.00%",
        day: "0.00%",
      });
    }
  } else if (mode === "SELL") {
    const existing = await HoldingsModel.findOne({ name });
    if (!existing || existing.qty < qty) {
      return res.status(400).send("Insufficient holdings to sell");
    }
    existing.qty -= Number(qty);
    if (existing.qty === 0) {
      await HoldingsModel.deleteOne({ name });
    } else {
      await existing.save();
    }
  }

  res.json({ success: true, execPrice });
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