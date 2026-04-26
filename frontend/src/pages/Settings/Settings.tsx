import React, { useEffect, useState } from "react";
import "./Settings.scss";
import axios from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import Registration from "../../components/common/users/Registration/Registration";

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
        <div className="settings-content">
          {activeTab === "tab1" && (
            <div className="admin-user-tab">
              <div className="admin-user-card">
                <div className="admin-user-toolbar">
                  <div className="admin-user-toolbar-left">
                    <button
                      className="admin-user-tool-btn"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus size={16} />
                      Add User
                    </button>
                    <button
                      className="admin-user-tool-btn"
                      onClick={fetchUsers}
                      disabled={loading}
                    >
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                  </div>
                  <div className="admin-user-toolbar-right">
                    <div className="admin-user-search">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                {/* Table here */}
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr key={user.user_id}>
                          <td>{user.username}</td>
                          <td>{user.full_name}</td>
                          <td>{user.role}</td>
                          <td>
                            <button>
                              <Pencil size={16} />
                            </button>
                            <button>
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Registration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(newUser) => {
          setUsers([...users, newUser]);
        }}
      />
    </div>
  );
}
