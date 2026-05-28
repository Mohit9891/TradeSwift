import React from 'react';

function Hero() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '500' }}>Zerodha Products</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Sleek, modern, and intuitive trading platforms
      </p>
      <a href="https://zerodha.com/investments" style={{ color: '#387ed1' }}>
        Check out our investment offerings →
      </a>
    </div>
  );
}

export default Hero;