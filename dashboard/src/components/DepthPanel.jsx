import React, { useContext } from "react";
import GeneralContext from "./GeneralContext";

const DepthPanel = () => {
  const { selectedSymbol, depth, livePrices } = useContext(GeneralContext);
  const d = selectedSymbol ? depth[selectedSymbol] : null;
  const live = selectedSymbol ? livePrices[selectedSymbol] : null;

  if (!selectedSymbol) {
    return (
      <div style={{ padding: 16, color: "#666" }}>
        Select a symbol to see market depth.
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h3 className="title">
        {selectedSymbol} depth {live ? `₹${live.price}` : ""}
      </h3>
      {!d ? (
        <p>Waiting for depth…</p>
      ) : (
        <>
          {d.simulated && (
            <p style={{ color: "#a60", fontSize: 12 }}>
              Simulated depth — Yahoo exposes no order book. Real depth needs a broker feed.
            </p>
          )}
          <div style={{ display: "flex", gap: 24 }}>
            <table>
              <tbody>
                <tr><th>Bid</th><th>Qty</th></tr>
                {d.bids.map((b, i) => (
                  <tr key={i}><td className="profit">{b.price.toFixed(2)}</td><td>{b.qty}</td></tr>
                ))}
              </tbody>
            </table>
            <table>
              <tbody>
                <tr><th>Ask</th><th>Qty</th></tr>
                {d.asks.map((a, i) => (
                  <tr key={i}><td className="loss">{a.price.toFixed(2)}</td><td>{a.qty}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DepthPanel;
