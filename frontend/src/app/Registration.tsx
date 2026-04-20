import React, { useState } from "react";
import axios from "axios";


const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [full_name, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/auth/register", {
      username,
      full_name,
      password,
      role
    });
    const data = await response.data;
    alert(data.message || "Registration successful");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="auditor">Manager</option>
          <option value="auditor">Viewer</option>
          
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;