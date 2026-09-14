import React, { useState } from "react";

function SignUp() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";
  try {
    const res = await fetch(`${backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone, password }),  // mobile not phone
    });
    const data = await res.text();  // backend sends plain text, not JSON
    if (res.ok) {
      alert("Account created! Please login.");
      window.location.href = "/login";
    } else {
      alert(data);
    }
  } catch (err) {
    alert("Server error");
  }
};
  return (
    <div className="container">
      <div className="row text-center Signup-heading">
        <h1 className="Signup-heading-1">
          Open a free demat and trading account online
        </h1>
        <h3 className="Signup-heading-2">
          Start paper trading free and join learners practicing with ₹1,00,000
          of demo cash
        </h3>
      </div>
      <div className="row Signup-Main">
        <div className="col-6 d-none d-md-block">
          <img
            className="account_openImage"
            src="media/images/account_open.svg"
            alt=""
          />
        </div>
        <div className="col-12 col-md-6 SignUp-form">
          <h2>Create Account</h2>
          <span>Start your investment journey</span>

          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Create Account
            </button>
            <p className="mt-3">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;