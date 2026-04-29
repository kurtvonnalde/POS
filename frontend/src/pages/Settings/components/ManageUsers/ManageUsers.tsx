import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import Registration from "../../../../components/common/users/Registration/Registration";
import { useApiNotifier, useNotifications } from "../../../../components/common";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { appLogger } from "../../../../utils/logger";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
}

export default function ManageUsers() {
  const {
    warning: showWarning,
    info: showInfo,
  } = useNotifications();
  const { notifyApiSuccess, notifyApiError } = useApiNotifier();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/app_user");
      setUsers(res.data);
      setCurrentPage(1);

      if (res.data.length === 0) {
        showInfo({
          title: "No users found",
          message: "There are no registered users yet.",
        });
      }
    } catch (err) {
      appLogger.error("Error fetching users", err);
      notifyApiError(err, {
        title: "Fetch failed",
        fallbackMessage: "Unable to fetch users right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const usernameMatch = user.username
      .toLowerCase()
      .includes(searchUsername.toLowerCase());
    const roleMatch = selectedRole === "" || user.role === selectedRole;
    return usernameMatch && roleMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleDelete = async (userId: number) => {
    if (!userId) {
      showWarning({
        title: "No user selected",
        message: "Please choose a user before deleting.",
      });
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/app_user/${userId}`);
      setUsers(users.filter((user) => user.user_id !== userId));

      notifyApiSuccess({
        title: "User deleted",
        message: "The user account was removed successfully.",
      });
    } catch (err) {
      appLogger.error("Error deleting user", err, { userId });
      notifyApiError(err, {
        title: "Delete failed",
        fallbackMessage: "Unable to delete the selected user.",
      });
    }

    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  return (
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

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
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
                      <button onClick={() => {
                        setSelectedUserId(user.user_id);
                        setIsDeleteModalOpen(true);
                      }}>
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-user-pagination">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Registration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(newUser) => {
          setUsers([...users, newUser]);

          notifyApiSuccess({
            title: "User created",
            message: "A new user has been added successfully.",
          });
        }}
      />

      <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={() => handleDelete(selectedUserId!)}
/>

    </div>
  );
}
