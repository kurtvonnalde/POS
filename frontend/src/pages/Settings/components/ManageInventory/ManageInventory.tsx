import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Search, Trash, Pencil } from "lucide-react";
import "./ManageInventory.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface InventoryItem {
  inventory_id: number;
  product_id: number;
  quantity_on_hand: number;
  reorder_level: number;
  warehouse: string;
  updated_at: string;
}

interface ModalState {
  isOpen: boolean;
  editingId: number | null;
  formData: {
    product_id: string;
    quantity_on_hand: string;
    reorder_level: string;
    warehouse: string;
  };
}

export default function ManageInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    editingId: null,
    formData: {
      product_id: "",
      quantity_on_hand: "",
      reorder_level: "",
      warehouse: "",
    },
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/inventory/`);
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      alert("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setModal({
        isOpen: true,
        editingId: item.inventory_id,
        formData: {
          product_id: item.product_id.toString(),
          quantity_on_hand: item.quantity_on_hand.toString(),
          reorder_level: item.reorder_level.toString(),
          warehouse: item.warehouse,
        },
      });
    } else {
      setModal({
        isOpen: true,
        editingId: null,
        formData: {
          product_id: "",
          quantity_on_hand: "",
          reorder_level: "",
          warehouse: "",
        },
      });
    }
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      editingId: null,
      formData: {
        product_id: "",
        quantity_on_hand: "",
        reorder_level: "",
        warehouse: "",
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModal({
      ...modal,
      formData: {
        ...modal.formData,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: parseInt(modal.formData.product_id),
        quantity_on_hand: parseInt(modal.formData.quantity_on_hand),
        reorder_level: parseInt(modal.formData.reorder_level),
        warehouse: modal.formData.warehouse,
      };

      if (modal.editingId) {
        await axios.patch(`${API_BASE_URL}/inventory/${modal.editingId}`, payload);
        alert("Inventory updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/inventory/`, payload);
        alert("Inventory added successfully");
      }

      handleCloseModal();
      fetchInventory();
    } catch (err) {
      console.error("Error saving inventory:", err);
      alert("Failed to save inventory");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inventory?")) {
      try {
        // Note: You may need to implement delete in backend if not exists
        await axios.delete(`${API_BASE_URL}/inventory/${id}`);
        alert("Inventory deleted successfully");
        fetchInventory();
      } catch (err) {
        console.error("Error deleting inventory:", err);
        alert("Failed to delete inventory");
      }
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-user-tab">
      <div className="admin-user-card">
        <div className="admin-user-toolbar">
          <div className="admin-user-toolbar-left">
            <button
              className="admin-user-tool-btn"
              onClick={() => handleOpenModal()}
            >
              <Plus size={16} />
              Add Inventory
            </button>
            <button
              className="admin-user-tool-btn"
              onClick={() => fetchInventory()}
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
                placeholder="Search by Warehouse"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Inventory ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Warehouse</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.inventory_id}>
                  <td>{item.inventory_id}</td>
                  <td>{item.product_id}</td>
                  <td>{item.quantity_on_hand}</td>
                  <td>{item.reorder_level}</td>
                  <td>{item.warehouse}</td>
                  <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(item)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.inventory_id)}
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.isOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.editingId ? "Edit Inventory" : "Add Inventory"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product ID:</label>
                <input
                  type="number"
                  name="product_id"
                  value={modal.formData.product_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity on Hand:</label>
                <input
                  type="number"
                  name="quantity_on_hand"
                  value={modal.formData.quantity_on_hand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reorder Level:</label>
                <input
                  type="number"
                  name="reorder_level"
                  value={modal.formData.reorder_level}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Warehouse:</label>
                <input
                  type="text"
                  name="warehouse"
                  value={modal.formData.warehouse}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
