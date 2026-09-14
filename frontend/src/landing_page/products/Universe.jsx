import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Watchlists', desc: 'Seven lists of fifty symbols with live ticks, sparklines and one-tap trade actions.' },
  { title: 'Order types', desc: 'MARKET, LIMIT, SL and SLM across DAY, IOC and after-market sessions.' },
  { title: 'Positions', desc: 'Intraday P&L, square-offs, converts and F&O lot-size enforcement.' },
  { title: 'Funds ledger', desc: 'Demo float with margin blocks and a paise-accurate money trail.' },
  { title: 'Live charts', desc: 'Tick history with OHLC context and a simulated depth ladder.' },
  { title: 'Trade tape', desc: 'Every order as a timeline with modify, cancel and fill states.' },
];

function Universe() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '8px' }}>
        One account, whole market
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', marginBottom: '40px' }}>
        Everything a dashboard needs to teach — nothing that risks real money
      </p>
      <div className="row">
        {features.map((f, index) => (
          <div key={index} className="col-12 col-md-4" style={{ marginBottom: '24px' }}>
            <div className="signal-card" style={{ height: '100%' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/signup" className="btn btn-primary">
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default Universe;
