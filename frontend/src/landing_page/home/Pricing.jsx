import React from "react";

function Pricing() {
  return (
    <div className="container p-5">
      <div className="row p-5">
        <div className="col-6 p-4">
          <h1>Unbeatable pricing</h1>
          <p>
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
        </div>
        <div className="col-6">
          <div className="row " style={{gap:"20px"}}>
            <div
              className="col-4 m-3"
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "center", // horizontal alignment
                alignItems: "center",
                fontSize:"10px"
              }}
            >
              <img src="media/images/pricing-eq.svg" alt="" /> Free account
              opening
            </div>
            <div
              className="col-4 m-3"
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "center", // horizontal alignment
                alignItems: "center",
                fontSize:"10px"
              }}
            >
              <img src="media/images/pricing-eq.svg" alt="" />
              Free equity delivery and direct mutual funds
            </div>
            <div
              className="col-4 m-3"
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "center", // horizontal alignment
                alignItems: "center",
                fontSize:"10px"
              }}
            >
              <img src="media/images/other-trades.svg" alt="" />
              Intraday and F&O
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
