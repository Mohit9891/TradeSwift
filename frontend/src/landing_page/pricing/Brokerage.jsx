import React, { useState } from 'react';

const tabs = ['Equity', 'Currency', 'Commodity'];

const equityData = [
  {
    label: 'Brokerage',
    delivery: 'Zero Brokerage',
    intraday: '0.03% or ₹20/order whichever is lower',
    futures: '0.03% or ₹20/order whichever is lower',
    options: 'Flat ₹20 per executed order',
  },
  {
    label: 'STT/CTT',
    delivery: '0.1% on buy & sell',
    intraday: '0.025% on sell side',
    futures: '0.05% on sell side',
    options: '0.15% on sell side (on premium)',
  },
  {
    label: 'Transaction charges',
    delivery: 'NSE: 0.00307% | BSE: 0.00375%',
    intraday: 'NSE: 0.00307% | BSE: 0.00375%',
    futures: 'NSE: 0.00183% | BSE: 0',
    options: 'NSE: 0.03553% | BSE: 0.0325% (on premium)',
  },
  {
    label: 'GST',
    delivery: '18% on (brokerage + SEBI + transaction charges)',
    intraday: '18% on (brokerage + SEBI + transaction charges)',
    futures: '18% on (brokerage + SEBI + transaction charges)',
    options: '18% on (brokerage + SEBI + transaction charges)',
  },
  {
    label: 'SEBI charges',
    delivery: '₹10 / crore',
    intraday: '₹10 / crore',
    futures: '₹10 / crore',
    options: '₹10 / crore',
  },
  {
    label: 'Stamp charges',
    delivery: '0.015% or ₹1500/crore on buy side',
    intraday: '0.003% or ₹300/crore on buy side',
    futures: '0.002% or ₹200/crore on buy side',
    options: '0.003% or ₹300/crore on buy side',
  },
];

const accountCharges = [
  { type: 'Individual account', charge: 'Free' },
  { type: 'Minor account', charge: 'Free' },
  { type: 'NRI account', charge: '₹500' },
  { type: 'HUF account', charge: 'Free (online) / ₹500 (offline)' },
  { type: 'Partnership, LLP, and Corporate accounts', charge: '₹500' },
];

const amcCharges = [
  { value: 'Up to ₹4 lakh', charge: 'Free*' },
  { value: '₹4 lakh - ₹10 lakh', charge: '₹100 per year, charged quarterly*' },
  { value: 'Above ₹10 lakh', charge: '₹300 per year, charged quarterly' },
];

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const thStyle = {
  backgroundColor: '#387ed1',
  color: '#fff',
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '500',
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  color: '#555',
};

const trAltStyle = {
  backgroundColor: '#f9f9f9',
};

function Brokerage() {
  const [activeTab, setActiveTab] = useState('Equity');

  return (
    <div className="container" style={{ padding: '40px 0' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: '1px solid #387ed1',
              backgroundColor: activeTab === tab ? '#387ed1' : '#fff',
              color: activeTab === tab ? '#fff' : '#387ed1',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Equity Table */}
      {activeTab === 'Equity' && (
        <div style={{ overflowX: 'auto', marginBottom: '48px' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>Equity delivery</th>
                <th style={thStyle}>Equity intraday</th>
                <th style={thStyle}>F&O - Futures</th>
                <th style={thStyle}>F&O - Options</th>
              </tr>
            </thead>
            <tbody>
              {equityData.map((row, index) => (
                <tr key={index} style={index % 2 === 0 ? {} : trAltStyle}>
                  <td style={{ ...tdStyle, fontWeight: '500', color: '#333' }}>{row.label}</td>
                  <td style={tdStyle}>{row.delivery}</td>
                  <td style={tdStyle}>{row.intraday}</td>
                  <td style={tdStyle}>{row.futures}</td>
                  <td style={tdStyle}>{row.options}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '16px', color: '#387ed1', fontSize: '14px' }}>
            Calculate your costs upfront using our{' '}
            <a href="https://zerodha.com/brokerage-calculator" style={{ color: '#387ed1' }}>
              brokerage calculator →
            </a>
          </p>
        </div>
      )}

      {activeTab !== 'Equity' && (
        <p style={{ color: '#888', padding: '40px 0', textAlign: 'center' }}>
          {activeTab} charges coming soon.
        </p>
      )}

      {/* Account Opening Charges */}
      <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '16px' }}>
        Charges for account opening
      </h2>
      <table style={{ ...tableStyle, marginBottom: '48px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Type of account</th>
            <th style={thStyle}>Charges</th>
          </tr>
        </thead>
        <tbody>
          {accountCharges.map((row, index) => (
            <tr key={index} style={index % 2 === 0 ? {} : trAltStyle}>
              <td style={tdStyle}>{row.type}</td>
              <td style={tdStyle}>{row.charge}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AMC Charges */}
      <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '16px' }}>
        Demat AMC (Annual Maintenance Charge)
      </h2>
      <table style={{ ...tableStyle, marginBottom: '16px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Value of holdings</th>
            <th style={thStyle}>AMC</th>
          </tr>
        </thead>
        <tbody>
          {amcCharges.map((row, index) => (
            <tr key={index} style={index % 2 === 0 ? {} : trAltStyle}>
              <td style={tdStyle}>{row.value}</td>
              <td style={tdStyle}>{row.charge}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '13px', color: '#888' }}>
        * Lower AMC is applicable only if the account qualifies as a Basic Services Demat Account (BSDA).
      </p>

    </div>
  );
}

export default Brokerage;