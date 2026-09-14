import React, { useEffect, useState } from "react";
import api, { migrateTokenFromQuery, getToken, FRONTEND_URL } from "../utils/api";

const AuthGuard = ({ children }) => {
  const [state, setState] = useState({ checking: true, mobile: "" });

  useEffect(() => {
    migrateTokenFromQuery();
    const token = getToken();
    if (!token) {
      window.location.href = `${FRONTEND_URL}/login`;
      return;
    }
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.mobile) {
          localStorage.setItem("kite_mobile", res.data.mobile);
        }
        setState({ checking: false, mobile: res.data?.mobile || "" });
      })
      .catch(() => {
        localStorage.removeItem("kite_token");
        window.location.href = `${FRONTEND_URL}/login`;
      });
  }, []);

  if (state.checking) {
    return (
      <div style={{ padding: 32, fontFamily: "sans-serif" }}>
        Verifying session…
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGuard;
