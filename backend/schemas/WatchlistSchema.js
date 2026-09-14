const { Schema } = require("mongoose");

// Up to 7 lists per user, 50 symbols each (broker-app parity caps).
const WatchlistSchema = new Schema({
  userMobile: { type: String, required: true, index: true },
  name: { type: String, required: true },
  symbols: { type: [String], default: [] },
  position: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

WatchlistSchema.index({ userMobile: 1, name: 1 }, { unique: true });

module.exports = { WatchlistSchema };
