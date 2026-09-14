import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    title: 'Dashboard',
    tag: 'Watch · ticket · tape',
    shot: 'shot-a',
    initial: 'T',
    description: 'Streaming watchlists, a three-step order ticket and a live order tape — the trading surface, redesigned as a monitoring desk.',
    links: [
      { label: 'Open dashboard', to: '/login' },
      { label: 'How orders work', to: '/support' },
    ],
  },
  {
    title: 'Positions',
    tag: 'MIS · NRML · converts',
    shot: 'shot-b',
    initial: 'P',
    description: 'Average-costed intraday positions with live P&L, one-tap square-offs and delivery converts. Shorts allowed — it is practice money.',
    links: [
      { label: 'Try the demo', to: '/signup' },
    ],
  },
  {
    title: 'Learn mode',
    tag: 'Practice paths',
    shot: 'shot-c',
    initial: 'L',
    description: 'Start with delivery trades, graduate to intraday MIS, then weekly NIFTY options — one dashboard, increasing realism.',
    links: [],
  },
];

function LeftSection() {
  return (
    <div className="container">
      {products.map((product, index) => (
        <div key={index} className="row align-items-center" style={{ padding: '60px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="col-12 col-md-6">
            <div className={`product-shot ${product.shot}`}>
              <span className="shot-tag">{product.tag}</span>
              <span className="shot-initial">{product.initial}</span>
            </div>
          </div>
          <div className="col-12 col-md-6" style={{ paddingLeft: '40px' }}>
            <h2 style={{ fontSize: '24px' }}>{product.title}</h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: '1.8' }}>{product.description}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              {product.links.map((link, i) => (
                <Link key={i} to={link.to} style={{ textDecoration: 'none' }}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeftSection;
