// Phase 1 quote service: parallel Yahoo fetches with a concurrency cap,
// OHLC enrichment, and index quotes. One slow symbol no longer stalls the rest.
const axios = require("axios");

const r2 = (n) => (n === null || n === undefined ? null : Number(Number(n).toFixed(2)));

async function fetchMeta(yahooSymbol) {
  const res = await axios.get(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}`,
    { timeout: 8000 }
  );
  return res.data.chart.result[0].meta;
}

function toQuote(symbol, meta) {
  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose ?? meta.chartPreviousClose;
  const change = price - prevClose;
  return {
    symbol,
    price,
    change: r2(change),
    pChange: r2(prevClose ? (change / prevClose) * 100 : 0),
    isDown: change < 0,
    open: meta.regularMarketOpen ?? prevClose ?? price,
    high: meta.regularMarketDayHigh ?? price,
    low: meta.regularMarketDayLow ?? price,
    volume: meta.regularMarketVolume ?? 0,
    timestamp: Date.now(),
  };
}

// Legacy single-quote fetch (EQ shorthand). Prefer getQuotes().
async function getQuote(symbol, yahooSymbol = `${symbol}.NS`) {
  return toQuote(symbol, await fetchMeta(yahooSymbol));
}

// Batched fetch: [{symbol, yahoo}] -> {symbol: quote}. Failures are skipped
// individually so one bad symbol never poisons the batch.
async function getQuotes(pairs, concurrency = 5) {
  const out = {};
  for (let i = 0; i < pairs.length; i += concurrency) {
    const chunk = pairs.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      chunk.map(async ({ symbol, yahoo }) => ({
        symbol,
        quote: toQuote(symbol, await fetchMeta(yahoo)),
      }))
    );
    for (const s of settled) {
      if (s.status === "fulfilled") out[s.value.symbol] = s.value.quote;
      else console.log("quote fetch failed:", s.reason?.message);
    }
  }
  return out;
}

const INDICES = [
  { key: "NIFTY 50", yahoo: "^NSEI" },
  { key: "SENSEX", yahoo: "^BSESN" },
  { key: "BANKNIFTY", yahoo: "^NSEBANK" },
];

async function getIndices() {
  const out = [];
  for (const { key, yahoo } of INDICES) {
    try {
      const meta = await fetchMeta(yahoo);
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose ?? meta.chartPreviousClose;
      const change = price - prevClose;
      out.push({
        key,
        price: r2(price),
        change: r2(change),
        pChange: r2(prevClose ? (change / prevClose) * 100 : 0),
        isDown: change < 0,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.log(`index fetch failed for ${key}:`, err.message);
    }
  }
  return out;
}

module.exports = { getQuote, getQuotes, getIndices, INDICES };
