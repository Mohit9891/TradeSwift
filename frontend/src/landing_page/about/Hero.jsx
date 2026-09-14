import React from "react";

function Hero() {
  return (
    <div className="container mt-5">
      <div className="row mt-5 mb-4 p-5 border-bottom">
        <div className="text-center">
          <span className="signal-tag">About</span>
          <h2 className="fs-2">
            A trading dashboard you can break safely. <br />
            That's the whole idea.
          </h2>
        </div>
      </div>
      <div className="row">
        <div style={{ fontSize: "17px", lineHeight: "30px" }} className="col-12 col-md-6 p-3 p-md-5 mt-4 text-muted">
          <p>
            TradeSwift is a paper-trading simulator: live prices,
            real order types, margin blocks and a paise-accurate ledger —
            with ₹1,00,000 of fictional cash instead of a demat account.
          </p>
          <p>
            It was built to answer one question: how much of a brokerage
            dashboard can you faithfully recreate without an exchange,
            clearing corporation, or a single rupee?
          </p>
        </div>
        <div style={{ fontSize: "17px", lineHeight: "30px" }} className="col-12 col-md-6 p-3 p-md-5 mt-4 text-muted">
          <p>
            Under the hood: a MERN stack with WebSocket price rooms, a
            matching engine for LIMIT and stop orders, average-costed
            positions with realized P&L, and an append-only funds ledger.
          </p>
          <p>
            Nothing here is investment advice and nothing here trades real
            securities. Break things, learn fast.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
