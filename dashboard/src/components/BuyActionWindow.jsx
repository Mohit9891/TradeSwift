import React, { useState, useContext, useEffect, useRef } from "react";
import api from "../utils/api";
import GeneralContext from "./GeneralContext";
import Segmented from "./desk/Segmented";
import AnimatedNumeral from "./desk/AnimatedNumeral";
import "./BuyActionWindow.css";

const inr = (v) => (v == null ? "…" : Number(v).toLocaleString("en-IN"));

// Docked 3-step ticket: 1 Side → 2 Terms → 3 Commit. Tints with side color.
const BuyActionWindow = ({ uid, initialMode = "BUY" }) => {
  const { closeBuyWindow, livePrices } = useContext(GeneralContext);
  const live = livePrices[uid];

  const [mode, setMode] = useState(initialMode);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(live ? live.price : 0.0);
  const [product, setProduct] = useState("CNC");
  const [orderType, setOrderType] = useState("MARKET");
  const [validity, setValidity] = useState("DAY");
  const [limitPrice, setLimitPrice] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedStatus, setPlacedStatus] = useState("");
  const openPrice = useRef(live?.price);

  useEffect(() => {
    if (live) setStockPrice(live.price);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.price]);

  const movedPct = openPrice.current && live ? Math.abs((live.price - openPrice.current) / openPrice.current) * 100 : 0;
  const estimate = (Number(stockPrice) * Number(stockQuantity) || 0).toLocaleString("en-IN");

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    setPlacedStatus("");
    try {
      const res = await api.post(`/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
        product,
        orderType,
        validity,
        limitPrice: limitPrice === "" ? undefined : Number(limitPrice),
        triggerPrice: triggerPrice === "" ? undefined : Number(triggerPrice),
      });
      window.dispatchEvent(new CustomEvent("ts:orders-changed"));
      if (res.data?.status === "COMPLETE") {
        closeBuyWindow();
      } else {
        setPlacedStatus(`Order ${res.data?.status}${res.data?.note ? ` — ${res.data.note}` : ""}`);
      }
    } catch (e) {
      setError(e.response?.data || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  const isBuy = mode === "BUY";

  return (
    <div className={`ticket-dock ticket-side-${isBuy ? "buy" : "sell"}`}>
      <div className="ticket-head">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="ticket-sym">{uid}</span>
          <button className="icon-btn" onClick={closeBuyWindow}>✕</button>
        </div>
        <div className="ticket-live">
          <AnimatedNumeral value={live?.price} format={inr} />
        </div>
        {movedPct > 0.5 && (
          <div className="ticket-stale">
            Price moved {movedPct.toFixed(2)}% since you opened this ticket — estimate refreshed.
          </div>
        )}
      </div>

      <div className="ticket-body">
        <div>
          <div className="ticket-step">1 · Side</div>
          <Segmented signal value={mode} onChange={setMode} options={["BUY", "SELL"]} />
        </div>

        <div>
          <div className="ticket-step">2 · Terms</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            <Segmented
              value={product}
              onChange={setProduct}
              options={[
                { value: "CNC", label: "CNC", title: "Delivery" },
                { value: "MIS", label: "MIS", title: "Intraday" },
                { value: "NRML", label: "NRML", title: "Overnight F&O" },
              ]}
            />
            <Segmented value={orderType} onChange={setOrderType} options={["MARKET", "LIMIT", "SL", "SLM"]} />
            <Segmented
              value={validity}
              onChange={setValidity}
              options={[
                { value: "DAY", label: "DAY" },
                { value: "IOC", label: "IOC" },
                { value: "AMO", label: "AMO", title: "Queues until next open" },
              ]}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <div className="ticket-field" style={{ flex: 1 }}>
                <label>Qty</label>
                <input type="number" min="1" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
              </div>
              <div className="ticket-field" style={{ flex: 1 }}>
                <label>Price</label>
                <input type="number" step="0.05" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} />
              </div>
            </div>
            {(orderType === "LIMIT" || orderType === "SL") && (
              <div className="ticket-field">
                <label>Limit</label>
                <input type="number" step="0.05" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} />
              </div>
            )}
            {(orderType === "SL" || orderType === "SLM") && (
              <div className="ticket-field">
                <label>Trigger</label>
                <input type="number" step="0.05" value={triggerPrice} onChange={(e) => setTriggerPrice(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="ticket-step">3 · Commit</div>
          <div className="ticket-note" style={{ margin: "4px 0 8px" }}>
            Est. value ₹{estimate} · {product} · {orderType} · {validity}
          </div>
          {error && <div className="ticket-error">{error}</div>}
          {placedStatus && <div className="ticket-ok">{placedStatus}</div>}
          <button
            type="button"
            className={`ticket-commit ${isBuy ? "buy" : "sell"}`}
            disabled={placing}
            onClick={placeOrder}
            style={{ width: "100%", marginTop: 6 }}
          >
            {placing ? "Placing…" : `${isBuy ? "Buy" : "Sell"} ${uid}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
