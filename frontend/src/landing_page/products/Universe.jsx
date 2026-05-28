import React from 'react';

const partners = [
  { title: 'Zerodha Fund House', desc: 'Simple and transparent index funds to help you save for your goals.', url: 'https://www.zerodhafundhouse.com/' },
  { title: 'Streak', desc: 'Systematic trading platform to create and backtest strategies without coding.', url: 'https://streak.tech/' },
  { title: 'Sensibull', desc: 'Options trading platform to create strategies and analyze positions.', url: 'https://sensibull.com/' },
  { title: 'Smallcase', desc: 'Thematic investing platform for diversified baskets of stocks and ETFs.', url: 'https://smallcase.zerodha.com/' },
  { title: 'Tijori Finance', desc: 'Investment research platform with insights on stocks, sectors, and more.', url: 'https://www.tijorifinance.com/' },
  { title: 'Ditto', desc: 'Personalized advice on life and health insurance. No spam, no mis-selling.', url: 'https://joinditto.in/' },
];

function Universe() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '500', marginBottom: '8px' }}>
        The Zerodha Universe
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        Extend your trading and investment experience with our partner platforms
      </p>
      <div className="row">
        {partners.map((partner, index) => (
          <div key={index} className="col-4" style={{ marginBottom: '24px' }}>
            <a href={partner.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px', height: '100%', transition: 'box-shadow 0.2s' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                  {partner.title}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {partner.desc}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a href="https://zerodha.com/open-account/" className="btn btn-primary">
          Sign up for free
        </a>
      </div>
    </div>
  );
}

export default Universe;