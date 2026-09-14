import React, { useState } from "react";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";
    const dashboardUrl =
      import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, password }),
      });
      // Backend sends JSON on success but plain text on errors,
      // so parse defensively instead of res.json() (which throws).
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = text;
      }
      if (res.ok && data.token) {
        // NOTE: frontend (:5173) and dashboard (:3001) are different
        // origins, so localStorage is NOT shared between them. Hand the
        // session over via a one-time ?user= query param — the dashboard
        // moves it into its own localStorage and strips it from the URL
        // on first load (see dashboard src/utils/api.js).
        localStorage.setItem("kite_token", data.token);
        localStorage.setItem("kite_mobile", phone);
        const handoff = encodeURIComponent(
          JSON.stringify({ mobile: phone, token: data.token })
        );
        window.location.href = `${dashboardUrl}/?user=${handoff}`;
      } else {
        alert(typeof data === "string" && data ? data : "Invalid credentials");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="row Signup-Main">
        <div className="col-6 d-none d-md-block">
          <img
            className="account_openImage"
            src="media/images/account_open.svg"
            alt=""
          />
        </div>
        <div className="col-12 col-md-6 SignUp-form">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="tel"
                className="form-control"
                pattern="[0-9]{10}"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Login
            </button>
            <p className="mt-3">
              Don't have an account?{" "}
              <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;