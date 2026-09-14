import React, { useState, useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";
import api from "../utils/api";
import AnimatedNumeral from "./desk/AnimatedNumeral";

const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const Positions = () => {
  const { livePrices } = useContext(GeneralContext);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [confirmExit, setConfirmExit] = useState(false);

  const load = () => {
    api
      .get(`/allPositions`)
      .then((res) => setPositions(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    window.addEventListener("ts:orders-changed", load);
    return () => window.removeEventListener("ts:orders-changed", load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAll = () => window.dispatchEvent(new CustomEvent("ts:orders-changed"));

  const squareOff = async (p) => {
    setBusy(p.name + p.product);
    try {
      await api.post(`/positions/squareoff`, { name: p.name, product: p.product });
      refreshAll();
    } catch (e) {
      alert(e.response?.data || "Square-off failed");
    } finally {
      setBusy("");
    }
  };

  const convert = async (p) => {
    setBusy(p.name + p.product);
    try {
      await api.post(`/positions/convert`, { name: p.name, from: p.product, to: "CNC" });
      refreshAll();
    } catch (e) {
      alert(e.response?.data || "Convert failed");
    } finally {
      setBusy("");
    }
  };

  const exitAll = async () => {
    if (!confirmExit) {
      setConfirmExit(true);
      setTimeout(() => setConfirmExit(false), 4000);
      return;
    }
    setConfirmExit(false);
    setBusy("exit-all");
    try {
      const res = await api.post(`/positions/exit-all`);
      alert(`Closed ${res.data.closed} positions, realized ${inr(res.data.totalRealized)}`);
      refreshAll();
    } catch (e) {
      alert(e.response?.data || "Exit-all failed");
    } finally {
      setBusy("");
    }
  };

  if (loading) return <div className="orders">Loading positions…</div>;

  const enriched = positions.map((p) => {
    const ltp = livePrices[p.name]?.price ?? p.price;
    const unreal = (ltp - p.avg) * p.qty;
    return { ...p, ltp, pnl: unreal + (p.realizedPnl || 0) };
  });
  const dayTotal = enriched.reduce((s, p) => s + p.pnl, 0);
  const maxAbs = Math.max(1, ...enriched.map((p) => Math.abs(p.pnl)));

  return (
    <>
      <div className="equity-hero">
        <div>
          <div className="hero-label">Intraday P&L · {positions.length} open</div>
          <div className={`hero-num ${dayTotal >= 0 ? "rise" : "fall"}`}>
            <AnimatedNumeral value={Math.round(dayTotal * 100) / 100} format={inr} />
          </div>
        </div>
        <button className="icon-btn" disabled={busy === "exit-all"} onClick={exitAll}>
          {confirmExit ? "Tap again to exit all" : busy === "exit-all" ? "Exiting…" : "Exit all"}
        </button>
      </div>

      {!positions.length && (
        <div className="orders">
          <div className="no-orders">
            <p>No open positions. MIS/NRML fills appear here live.</p>
          </div>
        </div>
      )}

      {enriched
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .map((p) => (
          <div className="pos-card" key={`${p.product}-${p.name}`}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span className="pos-sym">{p.name}</span>
                <span className="chip">{p.product}</span>
                <span className="pos-meta">
                  {p.qty} × <span className="num">{Number(p.avg).toFixed(2)}</span> →{" "}
                  <AnimatedNumeral value={p.ltp} format={(v) => Number(v).toFixed(2)} />
                </span>
              </div>
              <div className="pnl-track">
                <i
                  style={{
                    left: p.pnl >= 0 ? "50%" : `${50 - (Math.abs(p.pnl) / maxAbs) * 50}%`,
                    width: `${(Math.abs(p.pnl) / maxAbs) * 50}%`,
                    background: p.pnl >= 0 ? "var(--rise)" : "var(--fall)",
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={`num ${p.pnl >= 0 ? "tone-rise" : "tone-fall"}`} style={{ fontSize: 18, fontWeight: 600 }}>
                <AnimatedNumeral value={Math.round(p.pnl * 100) / 100} format={inr} />
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button className="icon-btn" disabled={busy === p.name + p.product} onClick={() => squareOff(p)}>
                  Square off
                </button>
                <button
                  className="icon-btn"
                  disabled={busy === p.name + p.product}
                  onClick={() => convert(p)}
                  title="Deliver to holdings (CNC) at cost — no P&L"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Positions;
