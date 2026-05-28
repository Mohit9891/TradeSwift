import React from 'react';

const products = [
  {
    title: 'Console',
    description: 'The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.',
    links: [
      { label: 'Learn more', url: 'https://zerodha.com/products/console' },
    ],
    img: 'media/images/console.png',
  },
  {
    title: 'Kite Connect API',
    description: 'Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase.',
    links: [
      { label: 'Learn more', url: 'https://zerodha.com/products/api/' },
    ],
    img: 'media/images/kiteconnect.png',
  },
];

function RighsSection() {
  return (
    <div className="container">
      {products.map((product, index) => (
        <div key={index} className="row align-items-center" style={{ padding: '60px 0', borderBottom: '1px solid #eee' }}>
          <div className="col-6" style={{ paddingRight: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '500' }}>{product.title}</h2>
            <p style={{ color: '#555', lineHeight: '1.8' }}>{product.description}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              {product.links.map((link, i) => (
                <a key={i} href={link.url} style={{ color: '#387ed1', textDecoration: 'none' }}>
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
          <div className="col-6">
            <img src={product.img} alt={product.title} style={{ width: '100%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default RighsSection;