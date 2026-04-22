import React, { useEffect, useState } from "react";
import "./Settings.scss";
import axios from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import Register from "../../../component/users/Registration";

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
  const [currentPage, setCurrentPage] = useState(1);
  //search states
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const itemsPerPage = 10; // Display 10 users per page

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
      setCurrentPage(1); // Reset to first page on refresh
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search criteria
  const filteredUsers = users.filter((user) => {
    const usernameMatch = user.username
      .toLowerCase()
      .includes(searchUsername.toLowerCase());
    const roleMatch = selectedRole === "" || user.role === selectedRole;
    return usernameMatch && roleMatch;
  });

  // Calculate pagination values based on filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle page navigation
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  // const handleResetSearch = () => {
  //   setSearchUsername("");
  //   setSelectedRole("");
  //   setCurrentPage(1);
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <>
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
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={16} />
                  Add User
                </button>
              </div>
            </section>
            <section className="admin-user-search admin-user-card">
              <div className="admin-user-search-input-wrap">
                <Search size={16} className="admin-user-search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="admin-user-search-input"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
              </div>
              <select
                name="role"
                id="role"
                className="admin-user-search-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                type="button"
                className="admin-user-tool-btn admin-user-tool-btn-muted"
                onClick={handleSearch}
              >
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
                  {paginatedUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td className="admin-user-name">{user.username}</td>
                      <td>
                        <span
                          className="admin-user-role-pill"
                          data-role={user.role.toLowerCase()}
                        >
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
                          <button
                            type="button"
                            className="admin-user-delete-btn"
                          >
                            <Trash size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="admin-user-pagination">
                <p className="admin-user-pagination-info">
                  Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="admin-user-pagination-actions">
                  <button
                    type="button"
                    className="admin-user-tool-btn-pgn admin-user-tool-btn-pgn-muted"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="admin-user-pagination-page">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    type="button"
                    className="admin-user-tool-btn-pgn admin-user-tool-btn-pgn-muted"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

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

      <Register
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSaved={(newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser])
      }}
      />
    </div>
  );
}
