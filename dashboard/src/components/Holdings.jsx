import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";
import AnimatedNumeral from "./desk/AnimatedNumeral";

const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const Holdings = () => {
  const { livePrices } = useContext(GeneralContext);
  const [allHoldings, setAllHoldings] = useState([]);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    const load = () => {
      api.get(`/allHoldings`).then((res) => {
        setAllHoldings(res.data || []);
      });
    };
    load();
    window.addEventListener("ts:orders-changed", load);
    return () => window.removeEventListener("ts:orders-changed", load);
  }, []);

  const convertToMis = async (name) => {
    setBusy(name);
    try {
      await api.post(`/positions/convert`, { name, from: "CNC", to: "MIS" });
      window.dispatchEvent(new CustomEvent("ts:orders-changed"));
    } catch (e) {
      alert(e.response?.data || "Convert failed");
    } finally {
      setBusy("");
    }
  };

  const enriched = allHoldings.map((s) => {
    const ltp = livePrices[s.name]?.price ?? s.price;
    return { ...s, ltp, value: ltp * s.qty, pnl: ltp * s.qty - s.avg * s.qty };
  });
  const totalPnl = enriched.reduce((sum, s) => sum + s.pnl, 0);
  const totalVal = enriched.reduce((sum, s) => sum + s.value, 0);
  const maxAbs = Math.max(1, ...enriched.map((s) => Math.abs(s.pnl)));

  return (
    <>
      <div className="equity-hero">
        <div>
          <div className="hero-label">Delivery P&L · {enriched.length} holdings</div>
          <div className={`hero-num ${totalPnl >= 0 ? "rise" : "fall"}`}>
            <AnimatedNumeral value={Math.round(totalPnl * 100) / 100} format={inr} />
          </div>
        </div>
        <div className="num" style={{ opacity: 0.85, fontSize: 15 }}>
          {inr(totalVal)} invested value
        </div>
      </div>

      {enriched.length > 0 && (
        <div className="treemap">
          {enriched.map((s) => (
            <div
              key={s.name}
              className="tile"
              style={{
                flex: s.value / Math.max(1, totalVal),
                background: s.pnl >= 0 ? "var(--rise)" : "var(--fall)",
              }}
              title={`${s.name} · ${inr(s.value)}`}
            >
              <b>{s.name}</b>
              <small>{inr(s.value)}</small>
            </div>
          ))}
        </div>
      )}

      {!enriched.length && (
        <div className="orders">
          <div className="no-orders">
            <p>No delivery holdings yet. CNC buys land here.</p>
          </div>
        </div>
      )}

      {enriched
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .map((s) => (
          <div className="pos-card" key={s.name}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span className="pos-sym">{s.name}</span>
                <span className="pos-meta">
                  {s.qty} × <span className="num">{Number(s.avg).toFixed(2)}</span> →{" "}
                  <AnimatedNumeral value={s.ltp} format={(v) => Number(v).toFixed(2)} />
                </span>
              </div>
              <div className="pnl-track">
                <i
                  style={{
                    left: s.pnl >= 0 ? "50%" : `${50 - (Math.abs(s.pnl) / maxAbs) * 50}%`,
                    width: `${(Math.abs(s.pnl) / maxAbs) * 50}%`,
                    background: s.pnl >= 0 ? "var(--rise)" : "var(--fall)",
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={`num ${s.pnl >= 0 ? "tone-rise" : "tone-fall"}`} style={{ fontSize: 18, fontWeight: 600 }}>
                <AnimatedNumeral value={Math.round(s.pnl * 100) / 100} format={inr} />
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  className="icon-btn"
                  disabled={busy === s.name}
                  onClick={() => convertToMis(s.name)}
                  title="Move to intraday (MIS) at cost"
                >
                  → MIS
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Holdings;
