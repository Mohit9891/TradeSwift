// dashboard/src/components/GeneralContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = createContext();

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [livePrices, setLivePrices] = useState({});

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    socketRef.current = socket;

    socket.on("priceSnapshot", (snapshot) => {
      setLivePrices(snapshot);
    });

    socket.on("priceUpdate", (quote) => {
      setLivePrices((prev) => ({ ...prev, [quote.symbol]: quote }));
    });

    return () => socket.disconnect();
  }, []);

  const openBuyWindow = (uid) => {
    setSelectedStockUID(uid);
    setIsBuyWindowOpen(true);
  };

  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{ openBuyWindow, closeBuyWindow, livePrices }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;