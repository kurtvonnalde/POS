import { FaTimes } from "react-icons/fa";
import "./DeleteConfirmation.scss";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  username,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="manage-user-modal-overlay" onClick={onClose}>
      <div className="manage-user-modal manage-user-modal--danger" onClick={(e) => e.stopPropagation()}>
        <div className="manage-user-modal__header">
          <div>
            <h2>Delete User</h2>
            <p>This action is permanent and cannot be undone.</p>
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

        <div className="manage-user-modal__body">
          <p>
            You are about to remove
            {" "}
            <strong>{username || "this user"}</strong>
            .
          </p>
        </div>

        <div className="manage-user-modal__actions">
          <button
            className="manage-user-modal__button manage-user-modal__button--secondary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="manage-user-modal__button manage-user-modal__button--danger"
            onClick={onConfirm}
            type="button"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
