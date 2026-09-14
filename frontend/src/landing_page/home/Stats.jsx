import React from "react";
import { Link } from "react-router-dom";

const STATS = [
  { num: "132", label: "Tradable contracts seeded — NSE equities plus weekly NIFTY futures & options" },
  { num: "₹1L", label: "Demo float credited on signup. Margin blocks, ledger entries, fills — all simulated" },
  { num: "~180ms", label: "Server-to-screen tick delay on the local WebSocket price feed" },
  { num: "12", label: "Order combinations across MARKET/LIMIT/SL, DAY/IOC/AMO and CNC/MIS/NRML" },
];

function Stats() {
  return (
    <div className="container p-3">
      <div className="row p-5">
        <div className="col-12 col-md-6 p-3 p-md-5">
          <span className="signal-tag">Why paper trade</span>
          <h1 className="mb-4">Practice the dashboard, not the losses</h1>
          <h2 className="fs-4">Real mechanics, fake money</h2>
          <p className="text-muted">
            Orders route through a matching engine with limit/stoploss logic,
            margin blocks and a paise-accurate ledger — the same lifecycle a
            broker dashboard runs, minus the exchange.
          </p>
          <h2 className="fs-4">Built to learn on</h2>
          <p className="text-muted">
            Every fill, square-off and conversion is traceable in the tradebook.
            Break things here, not in a real demat account.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/products" style={{ textDecoration: "none" }}>
              Explore the dashboard <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Try the demo <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="row">
            {STATS.map((s) => (
              <div className="col-12 col-sm-6 mb-3" key={s.label}>
                <div className="signal-card" style={{ height: "100%" }}>
                  <div className="signal-num" style={{ fontSize: "2rem", fontWeight: 600 }}>{s.num}</div>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
