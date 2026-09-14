const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./auth");
const { WatchlistModel } = require("../models/WatchlistModel");
const { InstrumentModel } = require("../models/InstrumentModel");
const { DEFAULT_SYMBOLS } = require("../sockets/priceSocket");

const MAX_LISTS = 7;
const MAX_SYMBOLS = 50;

async function ensureDefault(userMobile) {
  const count = await WatchlistModel.countDocuments({ userMobile });
  if (count === 0) {
    await WatchlistModel.create({ userMobile, name: "Default", symbols: [...DEFAULT_SYMBOLS], position: 0 });
  }
}

// GET /watchlists — all lists (lazy-creates Default on first call)
router.get("/", authMiddleware, async (req, res) => {
  await ensureDefault(req.user.mobile);
  const lists = await WatchlistModel.find({ userMobile: req.user.mobile }).sort({ position: 1 });
  res.json(lists);
});

// POST /watchlists {name}
router.post("/", authMiddleware, async (req, res) => {
  const name = (req.body.name || "").trim().slice(0, 30);
  if (!name) return res.status(400).send("name is required");
  const count = await WatchlistModel.countDocuments({ userMobile: req.user.mobile });
  if (count >= MAX_LISTS) return res.status(400).send(`max ${MAX_LISTS} watchlists`);
  try {
    const list = await WatchlistModel.create({
      userMobile: req.user.mobile, name, symbols: [], position: count,
    });
    res.status(201).json(list);
  } catch {
    res.status(409).send("watchlist name already exists");
  }
});

// PUT /watchlists/:id {name}
router.put("/:id", authMiddleware, async (req, res) => {
  const name = (req.body.name || "").trim().slice(0, 30);
  if (!name) return res.status(400).send("name is required");
  const list = await WatchlistModel.findOneAndUpdate(
    { _id: req.params.id, userMobile: req.user.mobile },
    { name },
    { new: true }
  );
  if (!list) return res.status(404).send("not found");
  res.json(list);
});

// DELETE /watchlists/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const r = await WatchlistModel.deleteOne({ _id: req.params.id, userMobile: req.user.mobile });
  if (!r.deletedCount) return res.status(404).send("not found");
  res.json({ ok: true });
});

// POST /watchlists/:id/symbols {symbol} — validated against instrument master
router.post("/:id/symbols", authMiddleware, async (req, res) => {
  const symbol = (req.body.symbol || "").toUpperCase().trim();
  if (!symbol) return res.status(400).send("symbol is required");
  const inst = await InstrumentModel.findOne({ symbol, active: true });
  if (!inst) return res.status(404).send("unknown instrument");
  const list = await WatchlistModel.findOne({ _id: req.params.id, userMobile: req.user.mobile });
  if (!list) return res.status(404).send("not found");
  if (list.symbols.includes(symbol)) return res.json(list);
  if (list.symbols.length >= MAX_SYMBOLS) return res.status(400).send(`max ${MAX_SYMBOLS} symbols`);
  list.symbols.push(symbol);
  await list.save();
  res.json(list);
});

// DELETE /watchlists/:id/symbols/:symbol
router.delete("/:id/symbols/:symbol", authMiddleware, async (req, res) => {
  const list = await WatchlistModel.findOne({ _id: req.params.id, userMobile: req.user.mobile });
  if (!list) return res.status(404).send("not found");
  list.symbols = list.symbols.filter((s) => s !== req.params.symbol.toUpperCase());
  await list.save();
  res.json(list);
});

module.exports = router;
