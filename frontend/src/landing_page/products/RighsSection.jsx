import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    title: 'Reports',
    tag: 'Ledger · tradebook',
    shot: 'shot-d',
    initial: 'R',
    description: 'Every rupee traceable: an append-only funds ledger, margin blocks and a full tradebook for every fill.',
    links: [
      { label: 'See pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Simulator API',
    tag: 'REST + WebSocket',
    shot: 'shot-e',
    initial: 'A',
    description: 'The same authenticated REST and socket feeds the dashboard uses — 26 endpoints for instruments, orders, positions and funds.',
    links: [
      { label: 'Read support docs', to: '/support' },
    ],
  },
];

function RighsSection() {
  return (
    <div className="container">
      {products.map((product, index) => (
        <div key={index} className="row align-items-center" style={{ padding: '60px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="col-12 col-md-6" style={{ paddingRight: '40px' }}>
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
          <div className="col-12 col-md-6">
            <div className={`product-shot ${product.shot}`}>
              <span className="shot-tag">{product.tag}</span>
              <span className="shot-initial">{product.initial}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RighsSection;
