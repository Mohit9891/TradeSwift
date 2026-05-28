import React, { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    window.location.href = "http://localhost:5173/login";
  }, []);

  return <div>Redirecting to login...</div>;
};

export default Login;