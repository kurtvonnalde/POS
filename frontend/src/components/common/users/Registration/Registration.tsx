"use-client";

import React, { useState } from "react";
import axios from "axios";
import "./Registration.scss";
import { FaTimes } from "react-icons/fa";
import { useApiNotifier, useNotifications } from "../../";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface RegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newUser: any) => void; // Callback to pass new user data back to parent
}

export default function Registration({
  isOpen,
  onClose,
  onSaved,
}: RegistrationProps) {
  const { warning: showWarning } = useNotifications();
  const { notifyApiSuccess, notifyApiError } = useApiNotifier();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [full_name, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [roleId, setRoleId] = useState<number>(2); // Default: cashier (role_id 2)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setFullName("");
    setPassword("");
    setRetypePassword("");
    setRoleId(2);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // stop page reload
  const newErrors: Record<string, string> = {};

  if (!username) newErrors.username = "Username is required";
  if (!email) newErrors.email = "Email is required";
  if (!full_name) newErrors.full_name = "Full name is required";
  if (!password) newErrors.password = "Password is required";
  if (!retypePassword) newErrors.retypePassword = "Please confirm your password";

  if (password && retypePassword && password !== retypePassword) {
    newErrors.retypePassword = "Passwords do not match";
  }

  if (password && password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (!roleId) {
    newErrors.roleId = "Role is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showWarning({
      title: "Incomplete form",
      message: "Please review the required fields before submitting.",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      full_name,
      password,
      role_id: roleId,
    });

    const data = response.data;
    setErrors({});
    notifyApiSuccess({
      title: "Registration successful",
      message: data.message || "The user account has been created.",
    });
    onSaved(data);
    handleClose();
  } catch (error: any) {
    const isNetworkIssue = !axios.isAxiosError(error) || !error.response;
    const title = isNetworkIssue ? "Network error" : "Registration failed";
    const fallbackMessage = isNetworkIssue
      ? "Network error, please try again"
      : "Registration failed";

    const message = notifyApiError(error, {
      title,
      fallbackMessage,
    });

    setErrors({ submit: message });
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="register-modal-overlay"
      onClick={handleClose}
    >
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registration-header">
          <div>
            <h2>Create User</h2>
            <p>Fill in account details and assign an access role.</p>
          </div>
          <button
            className="registration-modal-close"
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="registration-block">
            <h3>Identity</h3>

          <div className="registration-form-grid">
            <div className="registration-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <span className="registration-error">{errors.username}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="registration-error">{errors.email}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                type="text"
                placeholder="Full Name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.full_name && (
                <span className="registration-error">{errors.full_name}</span>
              )}
            </div>
          </div>
          </div>

          <div className="registration-block">
            <h3>Security</h3>

          <div className="registration-form-grid">
            <div className="registration-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="registration-error">{errors.password}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="retypePassword">Confirm Password</label>
              <input
                id="retypePassword"
                type="password"
                placeholder="Confirm Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
              {errors.retypePassword && (
                <span className="registration-error">{errors.retypePassword}</span>
              )}
            </div>
          </div>
          </div>

          <div className="registration-block">
            <h3>Access</h3>

            <div className="registration-field full-width">
              <label htmlFor="roleId">Role</label>
              <select
                id="roleId"
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
              >
                <option value={1}>Admin</option>
                <option value={2}>Cashier</option>
                <option value={3}>Manager</option>
                <option value={4}>Viewer</option>
              </select>
              {errors.roleId && (
                <span className="registration-error">{errors.roleId}</span>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="registration-error full-width">{errors.submit}</div>
          )}

          <div className="registration-actions">
            <button
              type="button"
              className="registration-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="registration-submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
