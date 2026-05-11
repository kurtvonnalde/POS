import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Search, Trash, Pencil } from "lucide-react";
import "./ManageCategories.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
}

interface ModalState {
  isOpen: boolean;
  editingId: number | null;
  formData: {
    name: string;
    description: string;
  };
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    editingId: null,
    formData: {
      name: "",
      description: "",
    },
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/category/`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setModal({
        isOpen: true,
        editingId: category.category_id,
        formData: {
          name: category.name,
          description: category.description,
        },
      });
    } else {
      setModal({
        isOpen: true,
        editingId: null,
        formData: {
          name: "",
          description: "",
        },
      });
    }
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      editingId: null,
      formData: {
        name: "",
        description: "",
      },
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        name: modal.formData.name,
        description: modal.formData.description,
      };

      if (modal.editingId) {
        await axios.patch(`${API_BASE_URL}/category/${modal.editingId}`, payload);
        alert("Category updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/category/`, payload);
        alert("Category added successfully");
      }

      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API_BASE_URL}/category/${id}`);
        alert("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Add Categories
            </button>
            <button
              className="admin-user-tool-btn"
              onClick={() => fetchCategories()}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="categories-table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(category)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category.category_id)}
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
            <h2>{modal.editingId ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={modal.formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={modal.formData.description}
                  onChange={handleInputChange}
                  rows={3}
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
