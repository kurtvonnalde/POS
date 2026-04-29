import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./EditUserModal.scss";

interface EditableUser {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
}

interface EditUserPayload {
  username: string;
  full_name: string;
  role: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: EditUserPayload) => void;
  user: EditableUser | null;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: EditUserModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("cashier");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    setUsername(user.username);
    setFullName(user.full_name);
    setRole(user.role);
    setError("");
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!username.trim() || !fullName.trim() || !role.trim()) {
      setError("Username, full name, and role are required.");
      return;
    }

    onConfirm({
      username: username.trim(),
      full_name: fullName.trim(),
      role,
    });
  };

  return (
    <div className="manage-user-modal-overlay" onClick={onClose}>
      <div className="manage-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="manage-user-modal__header">
          <div>
            <h2>Edit User</h2>
            <p>Update account details and role access.</p>
          </div>
          <button
            className="manage-user-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form className="manage-user-modal__form" onSubmit={handleSubmit}>
          <div className="manage-user-modal__grid">
            <label className="manage-user-modal__field" htmlFor="edit-username">
              Username
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="manage-user-modal__field" htmlFor="edit-fullname">
              Full Name
              <input
                id="edit-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
          </div>

          <label className="manage-user-modal__field" htmlFor="edit-role">
            Role
            <select
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>

          {error ? <p className="manage-user-modal__error">{error}</p> : null}

          <div className="manage-user-modal__actions">
            <button className="manage-user-modal__button manage-user-modal__button--secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="manage-user-modal__button manage-user-modal__button--primary" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
