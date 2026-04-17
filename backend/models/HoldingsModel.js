const {model} = require("mongoose");

// const {HoldingSchema} = require('../schemas/HJoldingSchema');
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = new model("holding", HoldingsSchema);

module.exports = {HoldingsModel};