import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import GeneralContext from "./GeneralContext";

const TopBar = () => {
  const { logout, user } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu />

      <div className="topbar-user">
        <span className="topbar-mobile">📱 {user?.mobile}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;