const { model } = require("mongoose");
const { TradeSchema } = require("../schemas/TradeSchema");

const TradeModel = new model("trade", TradeSchema);

module.exports = { TradeModel };
