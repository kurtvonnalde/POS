import React, { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "./Login.scss";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      alert("Login successful");
      window.location.href = "/products";
      // Redirect based on role if included in token payload
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <h1>Welcome to KrawlPOS</h1>
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">KrawlPOS</div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your credentials</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(true)} />
                )}
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
