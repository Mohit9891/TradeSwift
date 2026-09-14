// Phase 1 price fan-out: clients subscribe to symbols (rooms q:<SYM>),
// depth on demand (rooms d:<SYM>), indices broadcast globally.
// Only subscribed symbols are polled — idle server does no Yahoo work beyond indices.
const { Server } = require("socket.io");
const { getQuotes, getIndices } = require("../services/quoteService");
const { generateDepth } = require("../services/depthService");
const { checkOpenOrders } = require("../services/matchingService");
const { InstrumentModel } = require("../models/InstrumentModel");

const DEFAULT_SYMBOLS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ONGC", "WIPRO", "M&M", "KPITTECH", "QUICKHEAL"];
const POLL_MS = 5000;
const INDICES_MS = 15000;

let latestPrices = {}; // symbol -> quote (also feeds /newOrder fills)
let latestIndices = [];
let yahooMap = new Map(); // symbol -> yahooSymbol (EQ only)

const symbolSubs = new Map(); // symbol -> Set(socketId)
const depthSubs = new Map(); // symbol -> Set(socketId)
let ioRef = null;

function track(map, symbol, id) {
  if (!map.has(symbol)) map.set(symbol, new Set());
  map.get(symbol).add(id);
}
function untrack(map, symbol, id) {
  const s = map.get(symbol);
  if (!s) return;
  s.delete(id);
  if (s.size === 0) map.delete(symbol);
}
function untrackAll(map, id) {
  for (const [symbol, set] of map) {
    set.delete(id);
    if (set.size === 0) map.delete(symbol);
  }
}

async function refreshYahooMap() {
  try {
    const rows = await InstrumentModel.find({ active: true, segment: "EQ" }).select("symbol yahooSymbol");
    yahooMap = new Map(rows.map((r) => [r.symbol, r.yahooSymbol || `${r.symbol}.NS`]));
  } catch (err) {
    console.log("yahoo map refresh failed:", err.message);
  }
}

function subscribedSymbols() {
  const set = new Set([...symbolSubs.keys(), ...depthSubs.keys()]);
  if (set.size === 0) return [...DEFAULT_SYMBOLS];
  return [...set];
}

function initPriceSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });
  ioRef = io;
  refreshYahooMap();
  setInterval(refreshYahooMap, 5 * 60 * 1000);

  io.on("connection", (socket) => {
    // Backward compat: legacy clients that never subscribe still get defaults.
    for (const s of DEFAULT_SYMBOLS) {
      track(symbolSubs, s, socket.id);
      socket.join(`q:${s}`);
    }
    const snap = Object.fromEntries(
      DEFAULT_SYMBOLS.filter((s) => latestPrices[s]).map((s) => [s, latestPrices[s]])
    );
    socket.emit("priceSnapshot", snap);
    if (latestIndices.length) socket.emit("indicesUpdate", latestIndices);

    socket.on("subscribe", (symbols) => {
      if (!Array.isArray(symbols)) return;
      for (const s of symbols.slice(0, 100)) {
        track(symbolSubs, s, socket.id);
        socket.join(`q:${s}`);
        if (latestPrices[s]) socket.emit("priceUpdate", latestPrices[s]);
      }
    });

    socket.on("unsubscribe", (symbols) => {
      if (!Array.isArray(symbols)) return;
      for (const s of symbols) {
        untrack(symbolSubs, s, socket.id);
        socket.leave(`q:${s}`);
      }
    });

    socket.on("depth:subscribe", (symbols) => {
      if (!Array.isArray(symbols)) return;
      for (const s of symbols.slice(0, 10)) {
        track(depthSubs, s, socket.id);
        socket.join(`d:${s}`);
        if (latestPrices[s]) socket.emit("depthUpdate", generateDepth(latestPrices[s]));
      }
    });

    socket.on("depth:unsubscribe", (symbols) => {
      if (!Array.isArray(symbols)) return;
      for (const s of symbols) {
        untrack(depthSubs, s, socket.id);
        socket.leave(`d:${s}`);
      }
    });

    socket.on("disconnect", () => {
      untrackAll(symbolSubs, socket.id);
      untrackAll(depthSubs, socket.id);
    });
  });

  const pollQuotes = async () => {
    const pairs = subscribedSymbols()
      .filter((s) => yahooMap.has(s))
      .map((s) => ({ symbol: s, yahoo: yahooMap.get(s) }));
    if (!pairs.length) return;
    const quotes = await getQuotes(pairs);
    for (const [symbol, quote] of Object.entries(quotes)) {
      latestPrices[symbol] = quote;
      io.to(`q:${symbol}`).emit("priceUpdate", quote);
      if (depthSubs.has(symbol)) {
        io.to(`d:${symbol}`).emit("depthUpdate", generateDepth(quote));
      }
    }
    // Phase 2 matching: fill resting LIMIT/SL, activate due AMOs.
    try {
      const dirty = await checkOpenOrders(quotes);
      if (dirty.length) io.emit("ordersChanged", { users: dirty });
    } catch (err) {
      console.log("matching failed:", err.message);
    }
  };

  const pollIndices = async () => {
    const idx = await getIndices();
    if (idx.length) {
      latestIndices = idx;
      io.emit("indicesUpdate", idx);
    }
  };

  pollQuotes();
  pollIndices();
  setInterval(pollQuotes, POLL_MS);
  setInterval(pollIndices, INDICES_MS);

  return io;
}

function getLatestPrice(symbol) {
  return latestPrices[symbol];
}
function getLatestIndices() {
  return latestIndices;
}

module.exports = { initPriceSocket, getLatestPrice, getLatestIndices, DEFAULT_SYMBOLS };
