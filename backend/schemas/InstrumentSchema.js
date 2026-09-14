const { Schema } = require("mongoose");

// Master list of tradable contracts. Phase 0: NSE cash equities + NIFTY
// futures/options. Yahoo quote symbol = yahooSymbol (EQ only; F&O are
// priced off the underlying in Phase 1+).
const InstrumentSchema = new Schema({
  symbol: { type: String, required: true }, // e.g. RELIANCE, NIFTY25D1824500CE
  exchange: { type: String, default: "NSE" }, // NSE | BSE
  segment: { type: String, required: true }, // EQ | FO
  instrumentType: { type: String, required: true }, // EQ | FUT | CE | PE
  underlying: { type: String }, // FO only, e.g. NIFTY
  expiry: { type: Date }, // FO only
  strike: { type: Number }, // CE/PE only
  lotSize: { type: Number, default: 1 },
  tickSize: { type: Number, default: 0.05 },
  circuitPct: { type: Number, default: 10 }, // approx; informational
  yahooSymbol: { type: String }, // EQ only, e.g. RELIANCE.NS
  active: { type: Boolean, default: true },
});

InstrumentSchema.index({ symbol: 1, exchange: 1 }, { unique: true });
InstrumentSchema.index({ segment: 1, active: 1 });

module.exports = { InstrumentSchema };
