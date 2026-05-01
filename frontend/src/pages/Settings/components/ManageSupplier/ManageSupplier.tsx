import { Pencil, Plus, RefreshCw, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { appLogger } from "../../../../utils/logger";
import {
  useApiNotifier,
  useNotifications,
} from "../../../../components/common";
import DeleteConfirmationModal from "./DeleteSupplierConfirmationModal";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

interface SupplierUpdatePayload {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

export default function ManageSupplier() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyApiSuccess, notifyApiError } = useApiNotifier();
  const { warning: showWarning, info: showInfo } = useNotifications();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");

  //get suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/supplier`);
      setSuppliers(res.data);
      if (res.data.length === 0) {
        showInfo({
          title: "No suppliers found",
          message: "There are no suppliers registered yet.",
        });
      }
    } catch (err) {
      appLogger.error("Error fetching suppliers", err);
      notifyApiError(err, {
        title: "Fetch failed",
        fallbackMessage: "Unable to fetch suppliers right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  //handle pagination

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  //search supplier implementation
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const nameMatch = supplier.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return nameMatch;
  });

  const handleDelete = async (supplierId: number) => {
    if (!supplierId) {
      showWarning({
        title: "No supplier selected",
        message: "Please select a supplier to delete.",
      });
      setIsDeleteModalOpen(false);
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/supplier/${supplierId}`);
      notifyApiSuccess({
        title: "Supplier deleted",
        message: "The supplier has been successfully deleted.",
      });
    } catch (err) {
      appLogger.error("Error deleting supplier", err);
      notifyApiError(err, {
        title: "Delete failed",
        fallbackMessage: "Unable to delete supplier right now.",
      });
    }

    setIsDeleteModalOpen(false);
    setSelectedSupplierId(null);
  };

  //delete function
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const selectedSupplier = suppliers.find(
    (supplier) => supplier.supplier_id === selectedSupplierId,
  );

  //add supplier function
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  //Edit Supplier function
  const handleEditSave = async (payload: SupplierUpdatePayload) => {
    if (!selectedSupplierId) {
      showWarning({
        title: "No supplier selected",
        message: "Please select a supplier to edit.",
      });
      setIsEditModalOpen(false);
      return;
    }
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/supplier/${selectedSupplierId}`,
        null,
        {
          params: {
            name: payload.name,
            contact_person: payload.contact_person,
            email: payload.email,
            phone: payload.phone,
          },
        },
      );
      const updatedSupplier = response.data as Supplier;

      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.supplier_id === selectedSupplierId
            ? {
                ...supplier,
                name: updatedSupplier.name,
                contact_person: updatedSupplier.contact_person,
                email: updatedSupplier.email,
                phone: updatedSupplier.phone,
              }
            : supplier,
        ),
      );
      notifyApiSuccess({
        title: "Supplier updated",
        message: "Supplier details were updated successfully.",
      });
    } catch (err) {
      appLogger.error("Error updating supplier", err, {
        supplierId: selectedSupplierId,
      });
      notifyApiError(err, {
        title: "Update failed",
        fallbackMessage: "Unable to update the selected supplier.",
      });
      return;
    }
    setIsEditModalOpen(false);
    setSelectedSupplierId(null);
  };

  return (
    <div className="admin-user-tab">
      <div className="admin-user-card">
        <div className="admin-user-toolbar">
          <div className="admin-user-toolbar-left">
            <button
              className="admin-user-tool-btn"
              onClick={() => setIsModalAddOpen(true)}
            >
              <Plus size={16} />
              Add Supplier
            </button>
            <button
              className="admin-user-tool-btn"
              onClick={fetchSuppliers}
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
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading suppliers...</div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_person}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedSupplierId(supplier.supplier_id);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSupplierId(supplier.supplier_id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSupplierId(null);
        }}
        onConfirm={() => handleDelete(selectedSupplierId!)}
        name={selectedSupplier?.name}
      />

      <AddSupplierModal
        isOpen={isModalAddOpen}
        onClose={() => setIsModalAddOpen(false)}
        onSaved={(newSupplier) => {
          setSuppliers([...suppliers, newSupplier]);
          notifyApiSuccess({
            title: "Supplier added",
            message: "A new supplier has been added successfully.",
          });
        }}
      />
      <EditSupplierModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupplierId(null);
        }}
        supplier={selectedSupplier as Supplier}
        onConfirm={handleEditSave}
      />
    </div>
  );
}
