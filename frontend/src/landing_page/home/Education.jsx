import React from "react";
import { Link } from "react-router-dom";

function Education() {
  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="product-shot shot-c">
            <span className="shot-tag">Inside the dashboard</span>
            <span className="shot-initial">PnL</span>
            <p style={{ opacity: 0.8 }}>Live positions, square-offs and converts — every number traceable to a fill.</p>
          </div>
        </div>
        <div className="col-md-6">
          <span className="signal-tag">Learn by doing</span>
          <h1>Market education, hands-on</h1>
          <p className="text-muted">
            Reading about stop-losses is forgettable. Placing one against a live
            feed — and watching it trigger — is not. The simulator is the lesson.
          </p>
          <Link to="/products" className="d-block mb-3 text-decoration-none fw-bold">
            See what you can practice <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <p className="text-muted">
            Start with delivery trades, graduate to intraday MIS, then try NIFTY
            weekly options — all with the same dashboard professionals recognize.
          </p>
          <Link to="/signup" className="d-block text-decoration-none fw-bold">
            Open a demo account <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Education;
