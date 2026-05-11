import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Search, Trash, Pencil, CheckCircle, Clock } from "lucide-react";
import "./SupplierOrders.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SupplierOrder {
  purchase_id: number;
  supplier_id: number;
  user_id: number;
  total_cost: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  supplier_name?: string;
  purchase_items?: PurchaseItem[];
}

interface PurchaseItem {
  purchase_item_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
}

interface Supplier {
  supplier_id: number;
  name: string;
}

interface Product {
  product_id: number;
  name: string;
  sku: string;
}

interface ModalState {
  isOpen: boolean;
  editingId: number | null;
  formData: {
    supplier_id: string;
    product_id: string;
    quantity: string;
    unit_cost: string;
  };
  items: Array<{
    product_id: number;
    quantity: number;
    unit_cost: number;
  }>;
}

export default function SupplierOrders() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    editingId: null,
    formData: {
      supplier_id: "",
      product_id: "",
      quantity: "",
      unit_cost: "",
    },
    items: [],
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/purchases/`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch supplier orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/suppliers/`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleOpenModal = (order?: SupplierOrder) => {
    if (order) {
      setModal({
        isOpen: true,
        editingId: order.purchase_id,
        formData: {
          supplier_id: order.supplier_id.toString(),
          product_id: "",
          quantity: "",
          unit_cost: "",
        },
        items: order.purchase_items || [],
      });
    } else {
      setModal({
        isOpen: true,
        editingId: null,
        formData: {
          supplier_id: "",
          product_id: "",
          quantity: "",
          unit_cost: "",
        },
        items: [],
      });
    }
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      editingId: null,
      formData: {
        supplier_id: "",
        product_id: "",
        quantity: "",
        unit_cost: "",
      },
      items: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModal({
      ...modal,
      formData: {
        ...modal.formData,
        [name]: value,
      },
    });
  };

  const handleAddItem = () => {
    if (!modal.formData.product_id || !modal.formData.quantity || !modal.formData.unit_cost) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      product_id: parseInt(modal.formData.product_id),
      quantity: parseInt(modal.formData.quantity),
      unit_cost: parseFloat(modal.formData.unit_cost),
    };

    setModal({
      ...modal,
      items: [...modal.items, newItem],
      formData: {
        ...modal.formData,
        product_id: "",
        quantity: "",
        unit_cost: "",
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    setModal({
      ...modal,
      items: modal.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modal.formData.supplier_id || modal.items.length === 0) {
      alert("Please select a supplier and add at least one item");
      return;
    }

    try {
      const totalCost = modal.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

      const payload = {
        supplier_id: parseInt(modal.formData.supplier_id),
        user_id: 1, // Default user
        total_cost: totalCost,
        status: "pending",
        purchase_items: modal.items,
      };

      if (modal.editingId) {
        await axios.patch(`${API_BASE_URL}/purchases/${modal.editingId}`, { status: "completed" });
        alert("Order updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/purchases/`, payload);
        alert("Order created successfully");
      }

      handleCloseModal();
      fetchOrders();
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order");
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.patch(`${API_BASE_URL}/purchases/${id}`, { status: "cancelled" });
        alert("Order cancelled successfully");
        fetchOrders();
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Failed to cancel order");
      }
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await axios.patch(`${API_BASE_URL}/purchases/${id}`, { status: "completed" });
      alert("Order marked as completed");
      fetchOrders();
    } catch (err) {
      console.error("Error completing order:", err);
      alert("Failed to complete order");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.purchase_id.toString().includes(searchTerm) &&
      (!statusFilter || order.status === statusFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };

  const totalCost = modal.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

  return (
    <div className="supplier-orders">
      <div className="orders-header">
        <h1>Supplier Order Management</h1>
        <p>Create and manage purchase orders from suppliers</p>
      </div>

      <div className="orders-card">
        <div className="orders-toolbar">
          <div className="orders-toolbar-left">
            <button className="orders-tool-btn" onClick={() => handleOpenModal()}>
              <Plus size={16} />
              New Order
            </button>
            <button className="orders-tool-btn" onClick={() => fetchOrders()} disabled={loading}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="orders-toolbar-right">
            <div className="orders-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="orders-stats">
          <div className="stat">
            <span className="label">Total Orders:</span>
            <span className="value">{filteredOrders.length}</span>
          </div>
          <div className="stat">
            <span className="label">Pending:</span>
            <span className="value">{filteredOrders.filter((o) => o.status === "pending").length}</span>
          </div>
          <div className="stat">
            <span className="label">Total Value:</span>
            <span className="value">${filteredOrders.reduce((sum, o) => sum + o.total_cost, 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.purchase_id}>
                  <td>#{order.purchase_id}</td>
                  <td>{order.supplier_name || `Supplier #${order.supplier_id}`}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.purchase_items?.length || 0}</td>
                  <td className="cost">${order.total_cost.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {order.status === "pending" && (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() => handleCompleteOrder(order.purchase_id)}
                          title="Mark as completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(order.purchase_id)}
                          title="Cancel order"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )}
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
            <h2>Create New Supplier Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier *:</label>
                <select
                  name="supplier_id"
                  value={modal.formData.supplier_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.supplier_id} value={supplier.supplier_id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="items-section">
                <h3>Add Items</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Product *:</label>
                    <select
                      name="product_id"
                      value={modal.formData.product_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quantity *:</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={modal.formData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit Cost *:</label>
                    <input
                      type="number"
                      name="unit_cost"
                      step="0.01"
                      min="0"
                      value={modal.formData.unit_cost}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="button" className="add-item-btn" onClick={handleAddItem}>
                    Add Item
                  </button>
                </div>

                {modal.items.length > 0 && (
                  <div className="items-list">
                    <h4>Order Items:</h4>
                    {modal.items.map((item, index) => {
                      const product = products.find((p) => p.product_id === item.product_id);
                      return (
                        <div key={index} className="item-row">
                          <span>{product?.name || `Product #${item.product_id}`}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>Unit Cost: ${item.unit_cost.toFixed(2)}</span>
                          <span className="item-total">${(item.quantity * item.unit_cost).toFixed(2)}</span>
                          <button
                            type="button"
                            className="remove-item"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      );
                    })}

                    <div className="items-total">
                      <span>Order Total:</span>
                      <span className="total-value">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn" disabled={modal.items.length === 0}>
                  Create Order
                </button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
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
