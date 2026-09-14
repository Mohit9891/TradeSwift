import React from "react";
import "./Team.css";

const systems = [
  {
    name: "Price fan-out",
    role: "Market data",
    bio: "Batched quote service with per-symbol socket rooms — the server polls only what someone watches.",
  },
  {
    name: "Matching engine",
    role: "Orders",
    bio: "MARKET/LIMIT/SL/SLM across DAY/IOC/AMO with a PENDING → OPEN → COMPLETE state machine.",
  },
  {
    name: "Position engine",
    role: "Portfolio",
    bio: "Signed quantities, average costing, realized P&L on reductions, square-off and converts.",
  },
  {
    name: "Funds ledger",
    role: "Money",
    bio: "Append-only, paise integers. Margin blocks, trade debits and credits — no float math on cash.",
  },
];

function Team() {
  return (
    <div className="team-page">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <span className="section-tag">Under the hood</span>
            <h2 className="founder-name">Four systems, one dashboard</h2>
            <p className="hero-bio">
              No team page with stock photos — here's what actually runs the
              simulator instead.
            </p>
          </div>
        </div>

        <hr className="team-divider" />

        <div className="team-section">
          <p className="team-section-label">Systems</p>
          <div className="cards-grid">
            {systems.map((m) => (
              <div className="team-card" key={m.name}>
                <div className="team-card-body">
                  <h6 className="team-card-name">{m.name}</h6>
                  <p className="team-card-role">{m.role}</p>
                  <p className="team-card-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
