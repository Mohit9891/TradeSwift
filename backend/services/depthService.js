// Simulated 5-level market depth. Yahoo exposes no depth feed, so bids/asks
// are generated deterministically-ish around LTP. ALWAYS flagged simulated —
// never present this as exchange depth. Real depth needs a broker WebSocket
// (Phase 5 / broker WebSocket).
const TICK = 0.05;
const LEVELS = 5;

const r2 = (n) => Number(Number(n).toFixed(2));

function generateDepth(quote, levels = LEVELS) {
  const mid = quote.price;
  const spreadTicks = 1;
  const bids = [];
  const asks = [];
  for (let i = 0; i < levels; i++) {
    const jitter = () => Math.floor(Math.random() * 40) + 1;
    bids.push({ price: r2(mid - (spreadTicks + i) * TICK), qty: jitter() });
    asks.push({ price: r2(mid + (spreadTicks + i) * TICK), qty: jitter() });
  }
  return { symbol: quote.symbol, bids, asks, simulated: true, timestamp: Date.now() };
}

module.exports = { generateDepth };
