const { Schema } = require("mongoose");

// Every fill, signed. The audit trail positions (and the Phase 2 tradebook)
// are derived from. Phase 3 writes these on each MIS/CNC fill.
const TradeSchema = new Schema({
  userMobile: { type: String, required: true, index: true },
  symbol: { type: String, required: true },
  product: { type: String, required: true }, // CNC | MIS | NRML
  mode: { type: String, required: true }, // BUY | SELL
  qty: { type: Number, required: true }, // always positive; direction from mode
  price: { type: Number, required: true }, // fill price
  orderRef: { type: Schema.Types.ObjectId }, // parent order (Phase 2 fills link here)
  note: { type: String }, // e.g. SQUARE_OFF, CONVERT
  createdAt: { type: Date, default: Date.now },
});

TradeSchema.index({ userMobile: 1, symbol: 1, createdAt: -1 });

module.exports = { TradeSchema };
