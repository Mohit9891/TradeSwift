import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const getUserFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");
  if (user) {
    const parsed = JSON.parse(decodeURIComponent(user));
    localStorage.setItem("user", JSON.stringify(parsed)); // save to dashboard's localStorage
    window.history.replaceState({}, "", "/dashboard");    // clean up URL
    return parsed;
  }
  return JSON.parse(localStorage.getItem("user")) || null;
};

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [user, setUser] = useState(getUserFromURL);

  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        user,
        login,
        logout,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;