import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import StatusPip from "./desk/StatusPip";
import Segmented from "./desk/Segmented";

const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const dayLabel = (id) => {
  const t = parseInt(String(id).slice(0, 8), 16) * 1000;
  const d = new Date(t);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [freshId, setFreshId] = useState(null);

  const load = (markFresh = false) => {
    api
      .get(`/allOrders`)
      .then((res) => {
        const data = res.data || [];
        if (markFresh && data.length) {
          setFreshId(data[0]._id);
          setTimeout(() => setFreshId(null), 1500);
        }
        setOrders(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const onChange = () => load(true);
    window.addEventListener("ts:orders-changed", onChange);
    return () => window.removeEventListener("ts:orders-changed", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async (id) => {
    try {
      await api.post(`/orders/${id}/cancel`);
      load();
    } catch (e) {
      alert(e.response?.data || "Cancel failed");
    }
  };

  const saveModify = async (o) => {
    try {
      await api.put(`/orders/${o._id}`, { limitPrice: Number(editPrice) });
      setEditing(null);
      load();
    } catch (e) {
      alert(e.response?.data || "Modify failed");
    }
  };

  if (loading) return <div className="orders">Loading orders…</div>;

  if (!orders.length) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  const shown =
    filter === "All" ? orders : orders.filter((o) => (o.status || "COMPLETE") === filter);
  let lastDay = "";

  return (
    <div>
      <h3 className="title">Order tape ({orders.length})</h3>
      <div style={{ marginBottom: 8 }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={["All", "OPEN", "PENDING", "COMPLETE", "CANCELLED", "REJECTED"]}
        />
      </div>

      {shown.map((o) => {
        const day = o._id ? dayLabel(o._id) : "";
        const showDay = day !== lastDay;
        lastDay = day;
        const live = ["OPEN", "PENDING"].includes(o.status || "COMPLETE");
        return (
          <React.Fragment key={o._id}>
            {showDay && <div className="tape-day">{day}</div>}
            <div className={`tape-entry${freshId === o._id ? " fresh" : ""}`}>
              <StatusPip status={o.status || "COMPLETE"} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <b style={{ fontFamily: "var(--font-display)" }}>{o.name}</b>
                  <span className={`chip ${o.mode === "BUY" ? "rise" : "fall"}`}>{o.mode}</span>
                  <span className="ticket-note">
                    {o.qty} × <span className="num">{Number(o.limitPrice ?? o.price ?? 0).toFixed(2)}</span>
                    {" · "}{o.orderType || "MARKET"} · {o.product || "CNC"}
                  </span>
                </div>
                <div className="ticket-note">{o.status || "COMPLETE"}</div>
                {editing === o._id && (
                  <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                    <input
                      type="number" step="0.05" style={{ width: 90 }}
                      className="num"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <button className="icon-btn primary" onClick={() => saveModify(o)}>Save</button>
                    <button className="icon-btn" onClick={() => setEditing(null)}>✕</button>
                  </div>
                )}
              </div>
              {live && editing !== o._id && (
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setEditing(o._id);
                      setEditPrice(String(o.limitPrice ?? o.price ?? ""));
                    }}
                  >
                    Modify
                  </button>
                  <button className="icon-btn" onClick={() => cancel(o._id)}>Cancel</button>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Orders;
