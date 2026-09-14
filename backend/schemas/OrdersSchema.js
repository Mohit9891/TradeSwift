const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userMobile: { type: String, index: true }, // owner; pre-Phase-0 rows have none
  name: String,
  qty: Number,
  price: Number,
  mode: String, // BUY | SELL
  product: { type: String, default: "CNC" }, // CNC | MIS | NRML
  orderType: { type: String, default: "MARKET" }, // MARKET | LIMIT | SL | SLM
  validity: { type: String, default: "DAY" }, // DAY | IOC | AMO
  status: { type: String, default: "COMPLETE" }, // PENDING | OPEN | COMPLETE | CANCELLED | REJECTED
  limitPrice: Number, // LIMIT / SL
  triggerPrice: Number, // SL / SLM
  filledQty: { type: Number, default: 0 },
  blockedPaise: { type: Number, default: 0 }, // margin currently held for this order
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = { OrdersSchema };
