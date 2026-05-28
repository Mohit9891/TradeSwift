import React from 'react';

function Hero() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '500' }}>Charges</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>List of all charges and taxes</p>

      <div className="row justify-content-center" style={{ marginTop: '40px', gap: '24px' }}>
        <div className="col-3" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', color: '#387ed1' }}>Free equity delivery</h2>
          <p style={{ color: '#555' }}>All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.</p>
        </div>
        <div className="col-3" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', color: '#387ed1' }}>Intraday and F&O trades</h2>
          <p style={{ color: '#555' }}>Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades.</p>
        </div>
        <div className="col-3" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', color: '#387ed1' }}>Free direct MF</h2>
          <p style={{ color: '#555' }}>All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;