const { Server } = require("socket.io");
const { getQuote } = require("../services/nseService");

const WATCHLIST = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ONGC", "WIPRO", "M&M", "KPITTECH", "QUICKHEAL"];

let latestPrices = {};

function initPriceSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.emit("priceSnapshot", latestPrices);
    socket.on("disconnect", () => {});
  });

  const pollOnce = async () => {

    
    for (const symbol of WATCHLIST) {
      try {
        const quote = await getQuote(symbol);
        // console.log(quote); 
        latestPrices[symbol] = quote;
        io.emit("priceUpdate", quote);
      } catch (err) {
        console.log(`NSE fetch failed for ${symbol}:`, err.message);
      }
      await new Promise((r) => setTimeout(r, 400)); // stagger — don't hammer NSE all at once
    }
  };

  pollOnce();
  setInterval(pollOnce, 5000);

  return io;
}

function getLatestPrice(symbol) {
  return latestPrices[symbol];
}

module.exports = { initPriceSocket, getLatestPrice };