import React from 'react';

function Hero() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <span className="signal-tag">Pricing</span>
      <h1 style={{ fontSize: '36px' }}>Free — it's play money</h1>
      <p style={{ fontSize: '18px', color: 'var(--ink-soft)' }}>No brokerage, no taxes, no DP charges. Simulation only.</p>

      <div className="row justify-content-center" style={{ marginTop: '40px', gap: '24px' }}>
        <div className="col-12 col-md-3 signal-card">
          <h2 style={{ fontSize: '20px' }}>₹0 everything</h2>
          <p className="text-muted">Delivery, intraday and F&O — all simulated fills cost nothing.</p>
        </div>
        <div className="col-12 col-md-3 signal-card">
          <h2 style={{ fontSize: '20px' }}>₹1,00,000 float</h2>
          <p className="text-muted">Demo cash on signup, with margin blocks tracked per order.</p>
        </div>
        <div className="col-12 col-md-3 signal-card">
          <h2 style={{ fontSize: '20px' }}>Real margin rules</h2>
          <p className="text-muted">MIS 20%, NRML 12%, lot-size and expiry guards — practice under constraints.</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
