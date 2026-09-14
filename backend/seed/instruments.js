// Phase 0 instrument seed: NSE cash equities + NIFTY weekly FUT/CE/PE.
// Run: node seed/instruments.js   (idempotent — upserts by symbol+exchange)
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const axios = require("axios");
const { InstrumentModel } = require("../models/InstrumentModel");

const EQ_SYMBOLS = [
  "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK",
  "KOTAKBANK", "LT", "BHARTIARTL", "ITC", "TITAN", "TATAMOTORS", "TATASTEEL",
  "JSWSTEEL", "HINDALCO", "ONGC", "NTPC", "POWERGRID", "ULTRACEMCO",
  "ASIANPAINT", "NESTLEIND", "HCLTECH", "TECHM", "WIPRO", "SUNPHARMA",
  "DRREDDY", "CIPLA", "DIVISLAB",   "APOLLOHOSP", "BAJFINANCE", "BAJFINSV",
  "MARUTI", "M&M", "HEROMOTOCO", "EICHERMOT", "GRASIM",
  "ADANIENT", "ADANIPORTS", "COALINDIA", "BPCL", "TATACONSUM", "PIDILITIND",
  "DIXON", "KPITTECH", "QUICKHEAL",
];

const NIFTY_LOT = 75;
const STRIKE_STEP = 50;

// Next `count` Thursday expiries (NSE weekly). Returns Dates at 15:30 IST.
function weeklyExpiries(count = 2) {
  const out = [];
  const d = new Date();
  d.setHours(15, 30, 0, 0);
  while (out.length < count) {
    if (d.getDay() === 4 && d > new Date()) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

async function niftySpot() {
  const res = await axios.get("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI");
  return res.data.chart.result[0].meta.regularMarketPrice;
}

function fmtExpiry(d) {
  const yy = String(d.getFullYear()).slice(2);
  const mon = "JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".substr(d.getMonth() * 3, 3);
  return `${String(d.getDate()).padStart(2, "0")}${mon}${yy}`; // e.g. 18SEP25
}

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  const ops = EQ_SYMBOLS.filter((s, i) => EQ_SYMBOLS.indexOf(s) === i).map(
    (symbol) => ({
      updateOne: {
        filter: { symbol, exchange: "NSE" },
        update: {
          $set: {
            symbol,
            exchange: "NSE",
            segment: "EQ",
            instrumentType: "EQ",
            lotSize: 1,
            tickSize: 0.05,
            circuitPct: 10,
            yahooSymbol: `${symbol}.NS`,
            active: true,
          },
        },
        upsert: true,
      },
    })
  );

  const spot = await niftySpot();
  const atm = Math.round(spot / STRIKE_STEP) * STRIKE_STEP;
  console.log(`NIFTY spot ${spot} -> ATM ${atm}`);
  for (const expiry of weeklyExpiries(2)) {
    const tag = fmtExpiry(expiry);
    ops.push({
      updateOne: {
        filter: { symbol: `NIFTY${tag}FUT`, exchange: "NSE" },
        update: {
          $set: {
            symbol: `NIFTY${tag}FUT`, exchange: "NSE", segment: "FO",
            instrumentType: "FUT", underlying: "NIFTY", expiry,
            lotSize: NIFTY_LOT, tickSize: 0.05, active: true,
          },
        },
        upsert: true,
      },
    });
    for (let k = -10; k <= 10; k++) {
      const strike = atm + k * STRIKE_STEP;
      for (const opt of ["CE", "PE"]) {
        const symbol = `NIFTY${tag}${strike}${opt}`;
        ops.push({
          updateOne: {
            filter: { symbol, exchange: "NSE" },
            update: {
              $set: {
                symbol, exchange: "NSE", segment: "FO", instrumentType: opt,
                underlying: "NIFTY", expiry, strike,
                lotSize: NIFTY_LOT, tickSize: 0.05, active: true,
              },
            },
            upsert: true,
          },
        });
      }
    }
  }

  const r = await InstrumentModel.bulkWrite(ops);
  console.log(`upserted=${r.upsertedCount} modified=${r.modifiedCount}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("seed failed:", e.message);
  process.exit(1);
});
