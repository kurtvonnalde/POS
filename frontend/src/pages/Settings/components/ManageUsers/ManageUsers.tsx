import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import Registration from "../../../../components/common/users/Registration/Registration";
import { useApiNotifier, useNotifications } from "../../../../components/common";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { appLogger } from "../../../../utils/logger";
import EditUserModal from "./EditUserModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
}

interface UserUpdatePayload {
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const selectedUser = users.find((user) => user.user_id === selectedUserId) ?? null;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/app_user`);
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
      await axios.delete(`${API_BASE_URL}/app_user/${userId}`);
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

  const handleEditSave = async (payload: UserUpdatePayload) => {
    if (!selectedUserId) {
      showWarning({
        title: "No user selected",
        message: "Please choose a user before editing.",
      });
      setIsEditModalOpen(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/app_user/${selectedUserId}`,
        null,
        {
          params: {
            username: payload.username,
            full_name: payload.full_name,
            role: payload.role,
          },
        },
      );

      const updatedUser = response.data as User;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === selectedUserId
            ? {
                ...user,
                username: updatedUser.username,
                full_name: updatedUser.full_name,
                role: updatedUser.role,
              }
            : user,
        ),
      );

      notifyApiSuccess({
        title: "User updated",
        message: "User details were updated successfully.",
      });
    } catch (err) {
      appLogger.error("Error updating user", err, { userId: selectedUserId });
      notifyApiError(err, {
        title: "Update failed",
        fallbackMessage: "Unable to update the selected user.",
      });
      return;
    }

    setIsEditModalOpen(false);
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
                      <button onClick={() => {
                        setSelectedUserId(user.user_id);
                        setIsEditModalOpen(true);
                      }}>
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
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
        onConfirm={() => handleDelete(selectedUserId!)}
        username={selectedUser?.username}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserId(null);
        }}
        user={selectedUser}
        onConfirm={handleEditSave}
      />

    </div>
  );
}
