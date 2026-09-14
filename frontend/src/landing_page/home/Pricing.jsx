import React from "react";

const CARDS = [
  { title: "₹0 brokerage", desc: "Simulation charges nothing. Learn order types without watching fees eat the lesson." },
  { title: "₹1,00,000 float", desc: "Demo cash on signup with margin blocks and a full ledger trail for every rupee." },
  { title: "Real mechanics", desc: "MIS 20% / NRML 12% margins, lot-size checks and expiry-day guards — like the real desk." },
];

function Pricing() {
  return (
    <div className="container p-5">
      <div className="row p-5 align-items-center">
        <div className="col-12 col-md-6 p-3 p-md-4">
          <span className="signal-tag">Pricing</span>
          <h1>Free forever. It's practice money.</h1>
          <p className="text-muted">
            No brokerage, no STT, no hidden charges — because no real orders
            ever leave this simulator.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <div className="row" style={{ gap: "12px" }}>
            {CARDS.map((c) => (
              <div className="col-12" key={c.title}>
                <div className="signal-card">
                  <h2 className="fs-5 mb-1">{c.title}</h2>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
