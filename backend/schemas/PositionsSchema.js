const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  userMobile: { type: String, index: true }, // owner; pre-Phase-0 rows have none
  product: String, // MIS | NRML (intraday/overnight derivatives & intraday equity)
  name: String,
  qty: Number, // signed: +long / -short
  avg: Number,
  price: Number, // last known LTP (refreshed live on client; Phase 2 stamps server-side)
  realizedPnl: { type: Number, default: 0 }, // booked by partial/full exits
  net: String,
  day: String,
  isLoss:Boolean,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = { PositionsSchema };

//  product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
