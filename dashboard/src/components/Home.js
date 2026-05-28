import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import GeneralContext from "./GeneralContext";

const Home = () => {
  const { user } = useContext(GeneralContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;