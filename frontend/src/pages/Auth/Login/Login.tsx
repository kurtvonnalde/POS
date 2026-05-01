import React, { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useApiNotifier, useNotifications } from "../../../components/common";
import "./Login.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Login: React.FC = () => {
  const { warning: showWarning } = useNotifications();
  const { notifyApiSuccess, notifyApiError } = useApiNotifier();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showWarning({
        title: "Missing credentials",
        message: "Please enter both username and password.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("roleName", data.role_name);

        notifyApiSuccess({
          title: "Login successful",
          message: `Welcome back, ${data.username}.`,
        });

        window.location.href = "/products";
       
      } else {
        notifyApiError(new Error(data?.detail || "Invalid username or password."), {
          title: "Login failed",
          fallbackMessage: "Invalid username or password.",
        });
      }
    } catch (err) {
      notifyApiError(err, {
        title: "Network error",
        fallbackMessage: "Unable to reach the server. Please try again.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <div className="login-hero">
          <span className="login-hero-badge">Retail Command Center</span>
          <h1>Run your store with confidence and speed.</h1>
          <p>
            KrawlPOS helps your team monitor products, sales, and inventory in one focused workspace.
          </p>

          <div className="login-hero-metrics">
            <div>
              <strong>Real-time</strong>
              <span>Sales visibility</span>
            </div>
            <div>
              <strong>Multi-role</strong>
              <span>Access control</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>Daily operations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-container login-card">
          <div className="login-logo">KrawlPOS</div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Sign in to continue managing your business.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              <div className="pass-input-div">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
