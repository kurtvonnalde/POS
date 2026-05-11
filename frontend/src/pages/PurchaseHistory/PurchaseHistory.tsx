import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Download, Eye } from "lucide-react";
import "./PurchaseHistory.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SaleRecord {
  sale_id: number;
  user_id: number;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  sale_items?: SaleItem[];
  payments?: Payment[];
}

interface SaleItem {
  sale_item_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
}

interface Payment {
  payment_id: number;
  payment_method: string;
  amount: number;
  reference_no: string;
}

interface DetailedSale extends SaleRecord {
  sale_items: SaleItem[];
  payments: Payment[];
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedPurchase, setSelectedPurchase] = useState<DetailedSale | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/sales/`);
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      alert("Failed to fetch purchase history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.sale_id.toString().includes(searchTerm) ||
      purchase.total_amount.toString().includes(searchTerm);

    const purchaseDate = new Date(purchase.sale_date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateFrom = !fromDate || purchaseDate >= fromDate;
    const matchesDateTo = !toDate || purchaseDate <= toDate;

    const matchesStatus = !statusFilter || purchase.status === statusFilter;

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus;
  });

  const handleViewDetails = (purchase: SaleRecord) => {
    // Create detailed sale object with default items/payments if missing
    setSelectedPurchase({
      ...purchase,
      sale_items: purchase.sale_items || [],
      payments: purchase.payments || [],
    });
    setShowDetails(true);
  };

  const handleExport = () => {
    if (filteredPurchases.length === 0) {
      alert("No purchases to export");
      return;
    }

    const csv = [
      ["Sale ID", "Date", "Status", "Subtotal", "Tax", "Discount", "Total"],
      ...filteredPurchases.map((p) => [
        p.sale_id,
        new Date(p.sale_date).toLocaleDateString(),
        p.status,
        p.subtotal.toFixed(2),
        p.tax_amount.toFixed(2),
        p.discount_amount.toFixed(2),
        p.total_amount.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <div className="purchase-history">
      <div className="history-header">
        <h1>Purchase History</h1>
        <p>View and manage all past purchases and transactions</p>
      </div>

      <div className="history-filters">
        <div className="filter-group">
          <label>Search by ID or Amount:</label>
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button className="export-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-label">Total Purchases:</span>
          <span className="stat-value">{filteredPurchases.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue:</span>
          <span className="stat-value">
            ${filteredPurchases.reduce((sum, p) => sum + p.total_amount, 0).toFixed(2)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Order:</span>
          <span className="stat-value">
            $
            {filteredPurchases.length > 0
              ? (filteredPurchases.reduce((sum, p) => sum + p.total_amount, 0) / filteredPurchases.length).toFixed(2)
              : "0.00"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">
            {filteredPurchases.filter((p) => p.status === "completed").length}
          </span>
        </div>
      </div>

      <div className="history-table-wrapper">
        {loading ? (
          <div className="loading">Loading purchase history...</div>
        ) : filteredPurchases.length === 0 ? (
          <div className="no-data">No purchases found</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.sale_id}>
                  <td className="sale-id">#{purchase.sale_id}</td>
                  <td>{new Date(purchase.sale_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(purchase.status)}`}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </td>
                  <td className="amount">${purchase.subtotal.toFixed(2)}</td>
                  <td className="amount">${purchase.tax_amount.toFixed(2)}</td>
                  <td className="amount discount">${purchase.discount_amount.toFixed(2)}</td>
                  <td className="amount total">${purchase.total_amount.toFixed(2)}</td>
                  <td className="action-cell">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(purchase)}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDetails && selectedPurchase && (
        <div className="details-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Purchase Details - Sale #{selectedPurchase.sale_id}</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="details-section">
                <h3>Transaction Information</h3>
                <div className="detail-row">
                  <span className="label">Sale ID:</span>
                  <span className="value">#{selectedPurchase.sale_id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(selectedPurchase.sale_date).toLocaleString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`value status-badge ${getStatusColor(selectedPurchase.status)}`}>
                    {selectedPurchase.status.charAt(0).toUpperCase() + selectedPurchase.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedPurchase.sale_items && selectedPurchase.sale_items.length > 0 && (
                <div className="details-section">
                  <h3>Items Purchased</h3>
                  <div className="items-table">
                    <div className="items-header">
                      <div className="item-id">Item ID</div>
                      <div className="item-qty">Qty</div>
                      <div className="item-price">Unit Price</div>
                      <div className="item-discount">Discount</div>
                      <div className="item-total">Line Total</div>
                    </div>
                    {selectedPurchase.sale_items.map((item) => (
                      <div key={item.sale_item_id} className="items-row">
                        <div className="item-id">#{item.sale_item_id}</div>
                        <div className="item-qty">{item.quantity}</div>
                        <div className="item-price">${item.unit_price.toFixed(2)}</div>
                        <div className="item-discount">${item.discount_amount.toFixed(2)}</div>
                        <div className="item-total">${item.line_total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="details-section">
                <h3>Financial Summary</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${selectedPurchase.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discount:</span>
                    <span>${selectedPurchase.discount_amount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${selectedPurchase.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${selectedPurchase.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedPurchase.payments && selectedPurchase.payments.length > 0 && (
                <div className="details-section">
                  <h3>Payment Information</h3>
                  {selectedPurchase.payments.map((payment) => (
                    <div key={payment.payment_id} className="payment-info">
                      <div className="detail-row">
                        <span className="label">Payment Method:</span>
                        <span className="value">
                          {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Amount:</span>
                        <span className="value">${payment.amount.toFixed(2)}</span>
                      </div>
                      {payment.reference_no && (
                        <div className="detail-row">
                          <span className="label">Reference:</span>
                          <span className="value">{payment.reference_no}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setShowDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
