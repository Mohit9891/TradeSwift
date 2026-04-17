import React from "react";

function Education() {
  return (
    <div className="container my-5">
      <div className="row ">
        {/* Left Side: Image */}
        <div className="col-md-6 text-center">
          <img
            src="media/images/education.svg"
            alt="Education"
            className="img-fluid"
            style={{ maxHeight: "300px" }}
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="col-md-6">
          <h1>Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <a href="#" className="d-block mb-3 text-decoration-none text-primary fw-bold">
            Varsity <i className="fa-solid fa-arrow-right"></i>
          </a>
          <p>
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <a href="#" className="d-block text-decoration-none text-primary fw-bold">
            TradingQ&A <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Education;
