import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import GeneralContext from "./GeneralContext";

import Funds from "./Funds";
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import ChartPanel from "./ChartPanel";
import DepthPanel from "./DepthPanel";
import WatchList from "./WatchList";

const Dashboard = () => {
  const { density } = useContext(GeneralContext);
  return (
    <div className="dashboard-container" data-density={density}>
      <WatchList />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/chart" element={<><ChartPanel /><DepthPanel /></>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
