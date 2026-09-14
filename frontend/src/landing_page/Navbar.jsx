import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg signal-nav">
      <div className="container p-2">
        <Link className="signal-wordmark" to="/">
          Trade<span>Swift</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link nav-hover" aria-current="page" to="/signup">
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/pricing">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/support">
                Support
              </Link>
            </li>
          </ul>
          <Link className="btn btn-primary" to="/login">
            Open dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
