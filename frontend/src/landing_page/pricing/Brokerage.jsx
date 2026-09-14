import React from 'react';

// Honest cost table for a simulator: what the engine enforces, not a broker's tariff.
const rows = [
  { label: 'Brokerage & taxes', delivery: '₹0 (simulated)', intraday: '₹0 (simulated)', futures: '₹0 (simulated)', options: '₹0 (simulated)' },
  { label: 'Margin blocked', delivery: 'Full value', intraday: '20% of value', futures: '12% of value', options: '12% of value' },
  { label: 'Lot enforcement', delivery: 'Any qty', intraday: 'Any qty', futures: 'Lot multiples (NIFTY 75)', options: 'Lot multiples (NIFTY 75)' },
  { label: 'Expiry rule', delivery: '—', intraday: '—', futures: 'No new positions on expiry day', options: 'No new positions on expiry day' },
];

function Brokerage() {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>What the simulator enforces</h2>
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: 'var(--card)' }}>
          <thead>
            <tr>
              {['', 'Equity delivery', 'Equity intraday', 'F&O futures', 'F&O options'].map((h) => (
                <th key={h} style={{ backgroundColor: 'var(--signal)', color: '#fff', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={i % 2 ? { backgroundColor: 'var(--paper)' } : {}}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{row.label}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{row.delivery}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{row.intraday}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{row.futures}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{row.options}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
        Real brokers add STT, GST, stamp duty and SEBI charges on top — none of that applies here, by design.
      </p>
    </div>
  );
}

export default Brokerage;
