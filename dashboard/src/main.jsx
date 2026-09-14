import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./theme.css";
import Home from "./components/Home";
import AuthGuard from "./components/AuthGuard";
import { GeneralContextProvider } from "./components/GeneralContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthGuard>
        <GeneralContextProvider>
          <Routes>
            <Route path="/*" element={<Home />} />
          </Routes>
        </GeneralContextProvider>
      </AuthGuard>
    </BrowserRouter>
  </React.StrictMode>
);