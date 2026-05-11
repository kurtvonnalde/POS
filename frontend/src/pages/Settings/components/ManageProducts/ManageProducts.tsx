import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Search, Trash, Pencil } from "lucide-react";
import "./ManageProducts.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Product {
  product_id: number;
  category_id: number;
  barcode: string;
  name: string;
  description: string;
  sku: string;
  unit_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ModalState {
  isOpen: boolean;
  editingId: number | null;
  formData: {
    category_id: string;
    barcode: string;
    name: string;
    description: string;
    sku: string;
    unit_price: string;
    is_active: boolean;
  };
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    editingId: null,
    formData: {
      category_id: "",
      barcode: "",
      name: "",
      description: "",
      sku: "",
      unit_price: "",
      is_active: true,
    },
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/category/`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setModal({
        isOpen: true,
        editingId: product.product_id,
        formData: {
          category_id: product.category_id.toString(),
          barcode: product.barcode,
          name: product.name,
          description: product.description,
          sku: product.sku,
          unit_price: product.unit_price.toString(),
          is_active: product.is_active,
        },
      });
    } else {
      setModal({
        isOpen: true,
        editingId: null,
        formData: {
          category_id: "",
          barcode: "",
          name: "",
          description: "",
          sku: "",
          unit_price: "",
          is_active: true,
        },
      });
    }
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      editingId: null,
      formData: {
        category_id: "",
        barcode: "",
        name: "",
        description: "",
        sku: "",
        unit_price: "",
        is_active: true,
      },
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setModal({
      ...modal,
      formData: {
        ...modal.formData,
        [name]: finalValue,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category_id: parseInt(modal.formData.category_id),
        barcode: modal.formData.barcode,
        name: modal.formData.name,
        description: modal.formData.description,
        sku: modal.formData.sku,
        unit_price: parseFloat(modal.formData.unit_price),
        is_active: modal.formData.is_active,
      };

      if (modal.editingId) {
        await axios.patch(`${API_BASE_URL}/products/${modal.editingId}`, payload);
        alert("Product updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/products/`, payload);
        alert("Product added successfully");
      }

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        alert("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
              Add Product
            </button>
            <button
              className="admin-user-tool-btn"
              onClick={() => fetchProducts()}
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
                placeholder="Search by name, SKU, barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>#{product.product_id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td className="barcode">{product.barcode}</td>
                  <td>#{product.category_id}</td>
                  <td className="price">${product.unit_price.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(product)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.product_id)}
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
            <h2>{modal.editingId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *:</label>
                  <input
                    type="text"
                    name="name"
                    value={modal.formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *:</label>
                  <select
                    name="category_id"
                    value={modal.formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU *:</label>
                  <input
                    type="text"
                    name="sku"
                    value={modal.formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Barcode *:</label>
                  <input
                    type="text"
                    name="barcode"
                    value={modal.formData.barcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unit Price *:</label>
                  <input
                    type="number"
                    name="unit_price"
                    step="0.01"
                    value={modal.formData.unit_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={modal.formData.is_active}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
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
                  Save Product
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
