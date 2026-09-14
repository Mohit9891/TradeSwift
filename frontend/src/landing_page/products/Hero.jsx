import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <span className="signal-tag">Products</span>
      <h1 style={{ fontSize: '36px' }}>One dashboard, five surfaces</h1>
      <p style={{ fontSize: '18px', color: 'var(--ink-soft)' }}>
        Watch, ticket, tape, portfolio and ledger — designed as one desk
      </p>
      <Link to="/signup">
        Start practicing →
      </Link>
    </div>
  );
}

export default Hero;
