import React, { useState } from "react";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const user = JSON.stringify({ mobile: phone, token: data.token });
        const encoded = encodeURIComponent(user);
        window.location.href = `http://localhost:3001/dashboard?user=${encoded}`;
      } else {
        alert(data);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="row Signup-Main">
        <div className="col-6">
          <img
            className="account_openImage"
            src="media/images/account_open.svg"
            alt=""
          />
        </div>
        <div className="col-6 SignUp-form">
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