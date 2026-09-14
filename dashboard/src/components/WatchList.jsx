import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import api from "../utils/api";
import Sparkline from "./desk/Sparkline";
import AnimatedNumeral from "./desk/AnimatedNumeral";
import Segmented from "./desk/Segmented";

const inr = (v) => (v == null ? "…" : Number(v).toLocaleString("en-IN"));

const WatchList = () => {
  const { livePrices, priceHistory, selectedSymbol, setSelectedSymbol, subscribeSymbols } =
    useContext(GeneralContext);
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const load = () => {
    api.get(`/watchlists`).then((res) => {
      const data = res.data || [];
      setLists(data);
      setActiveId((prev) => (data.some((l) => l._id === prev) ? prev : data[0]?._id || ""));
    });
  };

  useEffect(() => {
    load();
    window.addEventListener("ts:orders-changed", load);
    return () => window.removeEventListener("ts:orders-changed", load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = lists.find((l) => l._id === activeId) || lists[0];
  const symbols = active ? active.symbols : [];

  useEffect(() => {
    const all = [...new Set(lists.flatMap((l) => l.symbols))];
    if (all.length) subscribeSymbols(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  useEffect(() => {
    const q = query.trim().toUpperCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      api.get(`/instruments?search=${encodeURIComponent(q)}`).then((res) => {
        const inList = new Set(symbols);
        setResults((res.data || []).filter((r) => !inList.has(r.symbol)).slice(0, 8));
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeId]);

  const addSymbol = (symbol) => {
    api.post(`/watchlists/${active._id}/symbols`, { symbol }).then((res) => {
      setLists((prev) => prev.map((l) => (l._id === active._id ? res.data : l)));
      setQuery("");
      setResults([]);
    });
  };

  const removeSymbol = (symbol) => {
    api.delete(`/watchlists/${active._id}/symbols/${symbol}`).then((res) => {
      setLists((prev) => prev.map((l) => (l._id === active._id ? res.data : l)));
    });
  };

  const openChart = (name) => {
    setSelectedSymbol(name);
    navigate("/chart");
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search instruments to add…"
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="counts"> {symbols.length} / 50</span>
      </div>

      {lists.length > 1 && (
        <div style={{ padding: "4px 2px 10px" }}>
          <Segmented
            signal
            value={active?._id}
            onChange={setActiveId}
            options={lists.map((l) => ({ value: l._id, label: l.name }))}
          />
        </div>
      )}

      {results.length > 0 && (
        <div className="desk-grid" style={{ gridTemplateColumns: "1fr" }}>
          {results.map((r) => (
            <div className="inst-card" key={r.symbol}>
              <div className="inst-head">
                <span className="inst-name">{r.symbol}</span>
                <span className="inst-xchg">{r.segment}</span>
              </div>
              <div className="inst-foot" style={{ marginTop: 8 }}>
                <span className="ticket-note">
                  {r.instrumentType}{r.strike ? ` · ${r.strike}` : ""}
                </span>
                <button className="icon-btn primary" onClick={() => addSymbol(r.symbol)}>
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="desk-grid">
        {symbols.map((name) => (
          <InstrumentCard
            key={name}
            name={name}
            live={livePrices[name]}
            spark={(priceHistory[name] || []).map((h) => h.p)}
            selected={selectedSymbol === name}
            onSelect={() => setSelectedSymbol(name)}
            onChart={() => openChart(name)}
            onRemove={() => removeSymbol(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchList;

const InstrumentCard = ({ name, live, spark, selected, onSelect, onChart, onRemove }) => {
  const { openBuyWindow } = useContext(GeneralContext);
  const [hover, setHover] = useState(false);
  const tone = !live ? "flat" : live.isDown ? "fall" : "rise";

  const act = (e, fn) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      className={`inst-card${selected ? " selected" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="inst-head">
        <span className="inst-name">{name}</span>
        <span className="inst-xchg">NSE</span>
      </div>
      <div className="inst-price">
        <AnimatedNumeral value={live?.price} format={inr} />
      </div>
      <div className="inst-foot">
        <span className={`chip ${tone === "flat" ? "" : tone}`}>
          {live ? `${live.pChange > 0 ? "▲ +" : "▼ "}${live.pChange}%` : "awaiting tick"}
        </span>
        <Sparkline data={spark.length > 1 ? spark : live ? [live.price, live.price] : []} tone={tone} />
      </div>
      {hover && (
        <div className="inst-actions" style={{ marginTop: 8 }}>
          <button className="icon-btn primary" onClick={(e) => act(e, () => openBuyWindow(name, "BUY"))}>Buy</button>
          <button className="icon-btn" onClick={(e) => act(e, () => openBuyWindow(name, "SELL"))}>Sell</button>
          <button className="icon-btn" onClick={(e) => act(e, onChart)} title="Open chart">Chart</button>
          <button className="icon-btn" onClick={(e) => act(e, onRemove)} title="Remove">✕</button>
        </div>
      )}
    </div>
  );
};
