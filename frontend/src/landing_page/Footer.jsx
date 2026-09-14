import React from "react";

function Footer() {
  return (
    <footer className="py-5 mt-5 signal-footer">
      <div className="container">
        <div className="row text-start">
          {/* Logo + Social + Copyright */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Trade<span style={{ color: "var(--signal)" }}>Swift</span></h5>
            <p className="text-muted">
              © 2026, TradeSwift paper-trading simulator. <br />
              A learning project — not a broker.
            </p>

            <div className="d-flex gap-2 mb-3">
              <i className="fab fa-x-twitter"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-linkedin"></i>
            </div>

            <div className="d-flex gap-2">
              <i className="fab fa-youtube"></i>
              <i className="fab fa-whatsapp"></i>
              <i className="fab fa-telegram"></i>
            </div>
          </div>

          {/* Account Column */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Account</h6>
            <ul className="list-unstyled text-muted">
              <li>Open demo account</li>
              <li>Demo cash top-up</li>
              <li>Reset simulator</li>
              <li>CNC delivery</li>
              <li>MIS intraday</li>
              <li>Fund ledger</li>
              <li>Tradebook</li>
              <li>Referral program</li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled text-muted">
              <li>Contact us</li>
              <li>Support portal</li>
              <li>How to file a complaint?</li>
              <li>Status of your complaints</li>
              <li>Bulletin</li>
              <li>Circular</li>
              <li>Journal</li>
              <li>Downloads</li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Company</h6>
            <ul className="list-unstyled text-muted">
              <li>About</li>
              <li>Philosophy</li>
              <li>Press & media</li>
              <li>Careers</li>
              <li>Open source</li>
              <li>Methodology</li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Quick links</h6>
            <ul className="list-unstyled text-muted">
              <li>Order types guide</li>
              <li>Margin rules</li>
              <li>Market hours</li>
              <li>F&O lots & expiry</li>
              <li>Watchlists</li>
              <li>Instruments</li>
              <li>API & sockets</li>
            </ul>
          </div>
        </div>
        <p>
          TradeSwift is a paper-trading simulator built for learning. Prices
          are live public market data, orders are simulated fills, and all
          cash balances are fictional. This is not a broker, not investment
          advice, and no real securities change hands here.
        </p>
        <p>
          Trading real markets involves risk, including possible loss of
          principal. Practice here first — then use a SEBI-registered broker
          with real KYC when you're ready.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
