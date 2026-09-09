import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow, livePrices } = useContext(GeneralContext);
  const live = livePrices[uid];

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(live ? live.price : 0.0);

  // keep the price field synced as new ticks stream in while the window is open
  useEffect(() => {
    if (live) setStockPrice(live.price);
  }, [live?.price]);

  const margin = (stockPrice * stockQuantity).toFixed(2);

  const placeOrder = (mode) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/newOrder`, {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode,
    });
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{margin}</span>
        <div>
          <button type="button" className="btn btn-blue" onClick={() => placeOrder("BUY")}>
            Buy
          </button>
          <button type="button" className="btn btn-grey" onClick={() => placeOrder("SELL")}>
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;