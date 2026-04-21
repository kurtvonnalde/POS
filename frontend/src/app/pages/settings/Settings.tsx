import React, { useEffect, useState } from "react";
import "./Settings.scss";
import axios from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import Register from "../../Registration";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
}

export default function Settings({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const tabs = [
    { id: "tab1", label: "Manage Users" },
    { id: "tab2", label: "Manage Supplier" },
    { id: "tab3", label: "Manage Inventory" },
    { id: "tab4", label: "Manage Categories" },
  ];

  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

  const fetchUsers = async () => {
    try {
      setLoading(true); // start loading
      const res = await axios.get("http://localhost:8000/app_user");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className={`settings-container ${isSidebarCollapsed ? "shrink" : ""}`}>
      <div className="settings-header">
        <h1>Settings Page</h1>
        <p>This is where you can manage your settings.</p>
      </div>
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="settings-content-wrapper">
        {activeTab === "tab1" && (
          <section className="admin-user-tab">
            <div className="admin-user-toolbar admin-user-card">
              <div className="admin-user-toolbar-left">
                <button
                  type="button"
                  className="admin-user-tool-btn admin-user-tool-btn-muted"
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  <RefreshCw size={16} />
                  {loading ? "Refreshing..." : "Refresh Users"}
                </button>
              </div>
              <button
                type="button"
                className="admin-user-tool-btn admin-user-tool-btn-muted"
                onClick={() => setShowRegistration(true)}
              >
                <Plus size={16} />
                Add User
              </button>
            </div>

            {showRegistration && (
              <div className="registration-form">
                <Register />
              </div>
            )}
          </section>
        )}

        <section className="admin-user-search admin-user-card">
          <div className="admin-user-search-input-wrap">
            <Search size={16} className="admin-user-search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="admin-user-search-input"
            />
          </div>
          <select name="role" id="role" className="admin-user-search-select">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Cashier</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>

          <button type="button" className="admin-user-tool-btn admin-user-tool-btn-muted">
            Search
          </button>
        </section>

        <section className="admin-user-table-card admin-user-card">
          <table className="admin-user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Full Name</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td className="admin-user-name">{user.username}</td>
                  <td>
                    <span className="admin-user-role-pill" data-role={user.role.toLowerCase()}>
                      {user.role}
                    </span>
                  </td>
                  <td className="admin-user-name">{user.full_name}</td>
                  <td>
                    <div className="admin-row-actions">
                       <button type="button" className="admin-user-edit-btn">
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button type="button" className="admin-user-delete-btn">
                      <Trash size={14} />
                      Delete
                    </button>
                    </div>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        

        {activeTab === "tab2" && (
          <div className="settings-content">
            <h2>Tab 2 Content</h2>
          </div>
        )}
        {activeTab === "tab3" && (
          <div className="settings-content">
            <h2>Tab 3 Content</h2>
          </div>
        )}
      </div>
    </div>
  );
}
