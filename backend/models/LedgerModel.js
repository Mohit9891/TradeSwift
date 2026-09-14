const { model } = require("mongoose");
const { LedgerSchema } = require("../schemas/LedgerSchema");

const LedgerModel = new model("ledger", LedgerSchema);

module.exports = { LedgerModel };
