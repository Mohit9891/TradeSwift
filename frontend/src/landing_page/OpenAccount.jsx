import React from "react";

function OpenAccount() {
  return (
    <div
      className="container"
      style={{
        margin: "0 auto",
        textAlign: "center",        // centers all inline and block elements horizontally
        padding: "50px 0",          // vertical spacing
      }}
    >
      <h1>Open Zerodha Account</h1>
      <p>
        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O
        trades.
      </p>
      <button
        className="p-2 mb-5 btn btn-primary fs-5"
        style={{ width: "200px", margin: "20px auto" }}
      >
        Sign up for free
      </button>
    </div>
  );
}

export default OpenAccount;
