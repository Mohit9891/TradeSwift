import React from "react";
import { Link } from "react-router-dom";

const TICKS = [
  { sym: "RELIANCE", price: "1,271.90", up: true, chg: "+0.84%" },
  { sym: "NIFTY 50", price: "23,445.75", up: true, chg: "+0.31%" },
  { sym: "INFY", price: "1,842.10", up: false, chg: "-0.42%" },
  { sym: "BANKNIFTY", price: "56,492.30", up: true, chg: "+0.58%" },
];

function Hero() {
  return (
    <div className="container py-5">
      <div className="row text-center">
        <div className="col-12">
          <span className="signal-tag">Paper-trading simulator · live prices</span>
          <h1 className="mt-3" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>
            Learn trading before money is on the line
          </h1>
          <p style={{ fontSize: "1.3rem" }} className="text-muted">
            Watchlists, order types, intraday positions and margin — a full
            trading dashboard with ₹1,00,000 of demo cash. Zero risk.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap my-4">
            <Link className="p-2 btn btn-primary fs-5 px-4" to="/signup">
              Start paper trading
            </Link>
            <Link className="p-2 btn btn-outline-secondary fs-5 px-4" to="/login">
              Open dashboard
            </Link>
          </div>
        </div>
        <div className="col-12 mt-4">
          <div className="dash-mock">
            <div className="tm-row" style={{ color: "#8b8fa0", fontSize: 12 }}>
              <span>TRADESWIFT · LIVE</span>
              <span className="signal-num">NSE</span>
            </div>
            {TICKS.map((t) => (
              <div className="tm-row" key={t.sym}>
                <span style={{ fontWeight: 600 }}>{t.sym}</span>
                <span className="signal-num">{t.price}</span>
                <span className={t.up ? "tm-up" : "tm-down"}>
                  {t.up ? "▲" : "▼"} {t.chg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
