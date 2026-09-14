// dashboard/src/components/GeneralContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = createContext();

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [orderMode, setOrderMode] = useState("BUY");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [livePrices, setLivePrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [indices, setIndices] = useState([]);
  const [depth, setDepth] = useState({}); // symbol -> {bids, asks, simulated}
  const [density, setDensity] = useState("comfortable"); // comfortable | compact

  const socketRef = useRef(null);

  useEffect(() => {
    const env = import.meta.env || {};
    const backendUrl =
      env.VITE_BACKEND_URL ||
      env.REACT_APP_BACKEND_URL ||
      "http://localhost:3002";
    const socket = io(backendUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("priceSnapshot", (snapshot) => {
      setLivePrices((prev) => ({ ...prev, ...(snapshot || {}) }));
    });

    socket.on("priceUpdate", (quote) => {
      if (!quote?.symbol) return;
      setLivePrices((prev) => ({ ...prev, [quote.symbol]: quote }));
      setPriceHistory((prev) => {
        const arr = prev[quote.symbol] || [];
        const next = [...arr, { t: quote.timestamp || Date.now(), p: quote.price }];
        return { ...prev, [quote.symbol]: next.slice(-120) };
      });
    });

    socket.on("indicesUpdate", (idx) => {
      if (Array.isArray(idx)) setIndices(idx);
    });

    socket.on("depthUpdate", (d) => {
      if (!d?.symbol) return;
      setDepth((prev) => ({ ...prev, [d.symbol]: d }));
    });

    // Phase 2 matching: a resting order filled/cancelled server-side.
    socket.on("ordersChanged", ({ users } = {}) => {
      const me = localStorage.getItem("kite_mobile");
      if (me && users?.includes(me)) {
        window.dispatchEvent(new CustomEvent("ts:orders-changed"));
      }
    });

    return () => socket.disconnect();
  }, []);

  const subscribeSymbols = (symbols) => {
    socketRef.current?.emit("subscribe", symbols || []);
  };

  // Depth follows the charted symbol.
  useEffect(() => {
    if (!selectedSymbol) return;
    socketRef.current?.emit("depth:subscribe", [selectedSymbol]);
    return () => socketRef.current?.emit("depth:unsubscribe", [selectedSymbol]);
  }, [selectedSymbol]);

  const openBuyWindow = (uid, mode = "BUY") => {
    setSelectedStockUID(uid);
    setOrderMode(mode);
    setIsBuyWindowOpen(true);
  };

  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setOrderMode("BUY");
  };

  const logout = () => {
    localStorage.removeItem("kite_token");
    const env = import.meta.env || {};
    const frontend =
      env.VITE_FRONTEND_URL ||
      env.REACT_APP_FRONTEND_URL ||
      "http://localhost:5173";
    window.location.href = `${frontend}/login`;
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        closeBuyWindow,
        livePrices,
        priceHistory,
        indices,
        depth,
        density,
        setDensity,
        subscribeSymbols,
        selectedStockUID,
        orderMode,
        selectedSymbol,
        setSelectedSymbol,
        logout,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow uid={selectedStockUID} initialMode={orderMode} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;