import React from "react";

const CAPS = [
  { num: "4", label: "Order types — MARKET, LIMIT, SL, SLM" },
  { num: "3", label: "Validities — DAY, IOC, AMO with market-hours queue" },
  { num: "3", label: "Products — CNC delivery, MIS intraday, NRML overnight" },
  { num: "5s", label: "Live tick refresh over WebSocket rooms" },
];

function Awards() {
  return (
    <div className="container my-5">
      <div className="row text-center">
        {CAPS.map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="signal-num" style={{ fontSize: "2rem", fontWeight: 600 }}>{c.num}</div>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Awards;
