import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";

const Menu = () => {
  const { logout } = useContext(GeneralContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const mobile = localStorage.getItem("kite_mobile") || localStorage.getItem("mobile") || "USERID";
  const initials = mobile.slice(0, 2).toUpperCase();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/chart"
              onClick={() => handleMenuClick(7)}
            >
              <p className={selectedMenu === 7 ? activeMenuClass : menuClass}>
                Chart
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile">
          <div className="avatar">{initials}</div>
          <div className="profile-card">
            <p className="profile-name">Trader</p>
            <p className="profile-number num">{mobile}</p>
            <button className="icon-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
