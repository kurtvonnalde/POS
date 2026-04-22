"use-client";

import React, { useState } from "react";
import axios from "axios";
import "./Registration.scss";
import { FaTimes } from "react-icons/fa";

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
  const [username, setUsername] = useState("");
  const [full_name, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setRetypePassword("");
    setRole("cashier");
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
  if (!full_name) newErrors.full_name = "Full name is required";
  if (!password) newErrors.password = "Password is required";
  if (!retypePassword) newErrors.retypePassword = "Please confirm your password";

  if (password && retypePassword && password !== retypePassword) {
    newErrors.retypePassword = "Passwords do not match";
  }

  if (password && password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (!role) {
    newErrors.role = "Role is required";
  } else if (!["admin", "cashier", "manager", "viewer"].includes(role)) {
    newErrors.role = "Invalid role selected";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await axios.post("http://localhost:8000/auth/register", {
      username,
      full_name,
      password,
      role,
    });

    const data = response.data; // no need for `await` here
    setErrors({});
    alert(data.message || "Registration successful");
    onSaved(data);
    handleClose();
  } catch (error: any) {
    if (error.response) {
      setErrors({ submit: error.response.data.detail || "Registration failed" });
    } else {
      setErrors({ submit: "Network error, please try again" });
    }
  }
};


  return (
    <div
      className="register-modal-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={handleClose}
    >
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registration-header">
          <div>
            <h2>Create User</h2>
            <p>Add new User to the system</p>
          </div>

          <button
            type="button"
            className="registration-modal-close"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="registration-error-banner">{errors.submit}</div>
          )}
          <div className="registration-form-grid">
            <div className="registration-field">
              <label>
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors({ ...errors, username: "" });
                    }
                  }}
                  className={errors.username ? "error" : ""}
                  required
                />
              </label>
              {errors.username && (
                <span className="registration-field-error">
                  {errors.username}
                </span>
              )}
            </div>
            <div className="registration-field">
              <label>
                Full Name
                <input
                  type="text"
                  value={full_name}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.full_name) {
                      setErrors({ ...errors, full_name: "" });
                    }
                  }}
                  className={errors.full_name ? "error" : ""}
                  required
                />
              </label>
              {errors.full_name && (
                <span className="registration-field-error">
                  {errors.full_name}
                </span>
              )}
            </div>
            <div className="registration-field">
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  className={errors.password ? "error" : ""}
                  required
                />
              </label>
              {errors.password && (
                <span className="registration-field-error">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="registration-field">
              <label>
                Retype Password
                <input
                  type="password"
                  value={retypePassword}
                  onChange={(e) => {
                    setRetypePassword(e.target.value);
                    if (errors.retypePassword) {
                      setErrors({ ...errors, retypePassword: "" });
                    }
                  }}
                  className={errors.retypePassword ? "error" : ""}
                  required
                />
              </label>
              {errors.retypePassword && (
                <span className="registration-field-error">
                  {errors.retypePassword}
                </span>
              )}
            </div>
            <div className="registration-field full-width">
              <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>
            </div>

            <div className="registration-form-actions">
              <button
                type="button"
                className="registration-btn registration-btn-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="registration-btn registration-btn-register"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
