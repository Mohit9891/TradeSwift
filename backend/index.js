require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
mongoose.connect(uri);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrders", async (req, res) => {
  let newOrders = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });
  newOrders.save();
  res.send();
});


app.listen(3002, () => {
  console.log("app started");
  mongoose.connect(uri);
  console.log("DB connected");
});

app.get("/", (req, res) => {
  res.send("working");
});
