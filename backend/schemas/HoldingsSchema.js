const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
  userMobile: { type: String, index: true }, // owner; pre-Phase-0 rows have none
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
});

module.exports = { HoldingsSchema };
