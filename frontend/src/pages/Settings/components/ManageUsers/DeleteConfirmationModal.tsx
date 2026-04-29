import { FaTimes } from "react-icons/fa";
import "./DeleteConfirmation.scss";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null; // don't render anything if modal is closed

  return (
    <div
      className="register-modal-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={onClose}
    >
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registration-header">
          <div>
            <h2>Delete User</h2>
            <p>Are you sure you want to delete this user?</p>
          </div>
          <button
            className="registration-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        <div>
          <button className="confirm-button" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
