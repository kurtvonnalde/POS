"use-client";
import React, { useState } from "react";
import axios from "axios";
import "./AddSupplierModal.scss";
import {useApiNotifier, useNotifications} from "../../../../components/common";
import { FaTimes } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface SupplierProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newSupplier: any) => void; // Callback to pass new supplier data back to parent
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSaved,
}: SupplierProps) {
    const [name, setName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { warning: showWarning } = useNotifications();
    const { notifyApiSuccess, notifyApiError } = useApiNotifier();

    const resetForm = () => {
      setName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setErrors({});
    }


  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Supplier name is required";
    if (!contactPerson) newErrors.contactPerson = "Contact person is required";
    if (!email) newErrors.email = "Email is required";
    if (!phone) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showWarning({
      title: "Incomplete form",
      message: "Please review the required fields before submitting.",
    });
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/supplier`, {
        name,
        contact_person: contactPerson,
        email,
        phone,
      });
      const data = response.data;
      setErrors({});
      notifyApiSuccess({
      title: "Registration successful",
      message: data.message || "The user account has been created.",
    });
    onSaved(data);
    handleClose();
    } catch (error: any) {
      const isNetworkIssue = !axios.isAxiosError(error) || !error.response;
      const title = isNetworkIssue ? "Network error" : "Registration failed";
      const fallbackMessage = isNetworkIssue
        ? "Network error, please try again"
        : "Registration failed";

      const message = notifyApiError(error, {
        title,
        fallbackMessage,
      });

      setErrors({ submit: message });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return null;
  }
  return (
    <div
          className="register-modal-overlay"
          onClick={handleClose}
        >
          <div className="register-modal" onClick={(e) => e.stopPropagation()}>
            <div className="registration-header">
              <div>
                <h2>Create Supplier</h2>
                <p>Fill in supplier details and assign an access role.</p>
              </div>
              <button
                className="registration-modal-close"
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>
    
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="registration-block">
                <h3>Identity</h3>
    
              <div className="registration-form-grid">
                <div className="registration-field">
                  <label htmlFor="name">Supplier Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Supplier Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <span className="registration-error">{errors.name}</span>
                  )}
                </div>
    
                <div className="registration-field">
                  <label htmlFor="contact_person">Contact Person</label>
                  <input
                    id="contact_person"
                    type="text"
                    placeholder="Contact Person"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                  {errors.contact_person && (
                    <span className="registration-error">{errors.contact_person}</span>
                  )}
                </div>
                <div className="registration-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && (
                    <span className="registration-error">{errors.phone}</span>
                  )}
                </div>
                <div className="registration-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <span className="registration-error">{errors.email}</span>
                  )}
                </div>
              </div>
              </div>
    
              {errors.submit && (
                <div className="registration-error full-width">{errors.submit}</div>
              )}
    
              <div className="registration-actions">
                <button
                  type="button"
                  className="registration-cancel"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="registration-submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
