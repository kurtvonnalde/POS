import { FaTimes } from 'react-icons/fa';
import './EditUserModal.scss';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
}: EditUserModalProps) {
  if (!isOpen) return null; // don't render anything if modal is closed

  return (
    <div className="register-modal-overlay"
    style={{ display: isOpen ? "flex" : "none" }}
      onClick={onClose}>
        
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
             <div className="registration-header">
               <div>
                 <h2>Create User</h2>
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
             <div className="register-modal-buttons">
               <button className="confirm-button" onClick={onConfirm}>
                 Save Changes
               </button>
               <button className="cancel-button" onClick={onClose}>
                 Cancel
               </button>
             </div>
             </div>
    </div>
  );
}
