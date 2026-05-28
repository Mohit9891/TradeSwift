import React from 'react';

const products = [
  {
    title: 'Kite',
    description: 'Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.',
    links: [
      { label: 'Try demo', url: 'https://kite-demo.zerodha.com/' },
      { label: 'Learn more', url: 'https://zerodha.com/products/kite' },
    ],
    img: 'media/images/kite.png',
  },
  {
    title: 'Coin',
    description: 'Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices.',
    links: [
      { label: 'Learn more', url: 'https://coin.zerodha.com/' },
    ],
    img: 'media/images/coin.png',
  },
  {
    title: 'Varsity mobile',
    description: 'An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go.',
    links: [],
    img: 'media/images/varsity.png',
  },
];

function LeftSection() {
  return (
    <div className="container">
      {products.map((product, index) => (
        <div key={index} className="row align-items-center" style={{ padding: '60px 0', borderBottom: '1px solid #eee' }}>
          <div className="col-6">
            <img src={product.img} alt={product.title} style={{ width: '100%' }} />
          </div>
          <div className="col-6" style={{ paddingLeft: '40px' }}>
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
        </div>
      ))}
    </div>
  );
}

export default LeftSection;