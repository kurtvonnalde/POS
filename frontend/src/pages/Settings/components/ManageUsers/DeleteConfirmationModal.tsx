import './DeleteConfirmation.scss';

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
    <div className="register-modal-overlay">
      <div className="register-modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="register-modal-buttons">
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
