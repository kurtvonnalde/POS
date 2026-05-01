import "./EditSupplierModal.scss";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface EditableSupplier {
  supplier_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

interface EditSupplierPayload {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: EditSupplierPayload) => void;
  supplier: EditableSupplier | null;
}

export default function EditSupplierModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
}: EditSupplierModalProps) {
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setContactPerson(supplier.contact_person);
      setEmail(supplier.email);
      setPhone(supplier.phone);
    }
  }, [supplier]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !name.trim() ||
      !contactPerson.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    onConfirm({ name: name.trim(),
         contact_person: contactPerson.trim(), 
         email: email.trim(), 
         phone: phone.trim() });
  };

  return !isOpen || !supplier ? null : (
    <div className="edit-supplier-modal-overlay" onClick={onClose}>
      <div className="edit-supplier-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-supplier-modal__header">
          <div>
            <h2>Edit Supplier</h2>
            <p>Update supplier details.</p>
          </div>
          <button
            className="edit-supplier-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form className="edit-supplier-modal__form" onSubmit={handleSubmit}>
          <div className="edit-supplier-modal__grid">
            <label className="edit-supplier-modal__field" htmlFor="edit-name">
              Name
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label
              className="edit-supplier-modal__field"
              htmlFor="edit-contact-person"
            >
              Contact Person
              <input
                id="edit-contact-person"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </label>
          </div>

          <label className="edit-supplier-modal__field" htmlFor="edit-email">
            Email
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="edit-supplier-modal__field" htmlFor="edit-phone">
            Phone
            <input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          {error ? <p className="edit-supplier-modal__error">{error}</p> : null}

          <div className="edit-supplier-modal__actions">
            <button
              className="edit-supplier-modal__button edit-supplier-modal__button--secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="edit-supplier-modal__button edit-supplier-modal__button--primary"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
