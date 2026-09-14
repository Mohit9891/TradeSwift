import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container" style={{ margin: "0 auto", textAlign: "center", padding: "50px 0" }}>
      <span className="signal-tag">30-second setup</span>
      <h1>Open a demo account</h1>
      <p className="text-muted">
        Mobile number, password, ₹1,00,000 demo float. No KYC, no money — it's a simulator.
      </p>
      <Link className="p-2 mb-5 btn btn-primary fs-5" style={{ width: "200px", margin: "20px auto" }} to="/signup">
        Sign up for free
      </Link>
    </div>
  );
}

export default OpenAccount;
