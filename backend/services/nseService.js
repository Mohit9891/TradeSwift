// backend/services/nseService.js — full replacement
const axios = require("axios");

async function getQuote(symbol) {
  const yahooSymbol = `${symbol}.NS`; // .NS = NSE-listed stock, Yahoo's suffix convention
  const res = await axios.get(
    `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`
  );
  const meta = res.data.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose;
  const change = price - prevClose;
  const pChange = (change / prevClose) * 100;

  return {
    symbol,
    price,
    change: Number(change.toFixed(2)),
    pChange: Number(pChange.toFixed(2)),
    isDown: change < 0,
    timestamp: Date.now(),
  };
}

module.exports = { getQuote };