const {model} = require("mongoose");

// const {HoldingSchema} = require('../schemas/HJoldingSchema');
const { PositionsSchema } = require("../schemas/PositionsSchema");

const PositionsModel = new model("positions", PositionsSchema);

module.exports = {PositionsModel};