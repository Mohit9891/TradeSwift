const { Schema } = require("mongoose");

// Append-only money trail. All amounts in PAISE (integers) — floats are
// display-only. Signed: +credit / -debit. Phase 2 adds MARGIN_* + PNL_SETTLE
// writes on fills; Phase 0 seeds OPENING + supports PAYIN/PAYOUT.
const LedgerSchema = new Schema({
  userMobile: { type: String, required: true, index: true },
  kind: {
    type: String,
    required: true,
    enum: [
      "OPENING",
      "PAYIN",
      "PAYOUT",
      "MARGIN_BLOCK",
      "MARGIN_RELEASE",
      "TRADE_DEBIT", // cash out on CNC BUY fill
      "TRADE_CREDIT", // cash in on CNC SELL fill
      "BROKERAGE",
      "PNL_SETTLE",
    ],
  },
  amountPaise: { type: Number, required: true }, // signed integer
  balanceAfterPaise: { type: Number, required: true },
  ref: { type: String }, // orderId / note reference
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

LedgerSchema.index({ userMobile: 1, createdAt: -1 });

module.exports = { LedgerSchema };
