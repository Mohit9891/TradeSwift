const { model } = require("mongoose");
const { InstrumentSchema } = require("../schemas/InstrumentSchema");

const InstrumentModel = new model("instrument", InstrumentSchema);

module.exports = { InstrumentModel };
