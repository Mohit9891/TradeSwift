import React, { useContext } from "react";

import Menu from "./Menu";
import GeneralContext from "./GeneralContext";
import Sparkline from "./desk/Sparkline";
import AnimatedNumeral from "./desk/AnimatedNumeral";

const inr = (v) => (v == null ? "…" : Number(v).toLocaleString("en-IN"));

// Signal strip: index + mover headline cards with sparklines, plus density toggle.
const TopBar = () => {
  const { indices, livePrices, priceHistory, density, setDensity } = useContext(GeneralContext);

  const movers = Object.values(livePrices)
    .filter((q) => q && q.pChange != null)
    .sort((a, b) => Math.abs(b.pChange) - Math.abs(a.pChange))
    .slice(0, 4);

  const sparkOf = (key, price) => {
    const hist = (priceHistory[key] || []).map((h) => h.p);
    return hist.length > 1 ? hist : [price, price];
  };

  return (
    <>
      <div className="signal-strip">
        {indices.length === 0 && (
          <div className="signal-card">
            <span className="sig-key">Connecting…</span>
          </div>
        )}
        {indices.map((idx) => (
          <div className="signal-card" key={idx.key}>
            <span className="sig-key">{idx.key}</span>
            <span className="sig-price">
              <AnimatedNumeral value={idx.price} format={inr} />
            </span>
            <span className={`sig-sub num ${idx.isDown ? "tone-fall" : "tone-rise"}`}>
              {idx.isDown ? "▼" : "▲"} {idx.pChange > 0 ? "+" : ""}{idx.pChange}%
            </span>
            <Sparkline data={sparkOf(idx.key, idx.price)} tone={idx.isDown ? "fall" : "rise"} />
          </div>
        ))}
        {movers.map((m) => (
          <div className="signal-card" key={m.symbol}>
            <span className="sig-key">{m.symbol} · mover</span>
            <span className="sig-price">
              <AnimatedNumeral value={m.price} format={inr} />
            </span>
            <span className={`sig-sub num ${m.isDown ? "tone-fall" : "tone-rise"}`}>
              {m.isDown ? "▼" : "▲"} {m.pChange > 0 ? "+" : ""}{m.pChange}%
            </span>
            <Sparkline data={sparkOf(m.symbol, m.price)} tone={m.isDown ? "fall" : "rise"} />
          </div>
        ))}
        <button
          className="icon-btn"
          style={{ alignSelf: "center", marginLeft: "auto" }}
          onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
          title="Toggle desk density"
        >
          {density === "compact" ? "Comfort" : "Compact"}
        </button>
      </div>
      <Menu />
    </>
  );
};

export default TopBar;
