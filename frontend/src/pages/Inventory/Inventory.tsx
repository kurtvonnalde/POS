import { useEffect, useState } from 'react';
import './Inventory.scss';

interface InventoryItem {
  inventory_id: number;
  product_id: number;
  quantity_on_hand: number;
  reorder_level: number;
  warehouse: string;
  updated_at: string;
}

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalQuantity: number;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalQuantity: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/inventory/`);
      const data = await response.json();
      setInventory(data);

      // Calculate statistics
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let totalQty = 0;

      data.forEach((item: InventoryItem) => {
        totalQty += item.quantity_on_hand;
        
        if (item.quantity_on_hand === 0) {
          outOfStockCount++;
        } else if (item.quantity_on_hand <= item.reorder_level) {
          lowStockCount++;
        }
      });

      setStats({
        totalItems: data.length,
        lowStockItems: lowStockCount,
        outOfStockItems: outOfStockCount,
        totalQuantity: totalQty
      });
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInventory = () => {
    switch (filterStatus) {
      case 'low':
        return inventory.filter(item => item.quantity_on_hand > 0 && item.quantity_on_hand <= item.reorder_level);
      case 'out':
        return inventory.filter(item => item.quantity_on_hand === 0);
      default:
        return inventory;
    }
  };

  const filteredInventory = getFilteredInventory();

  const getStatusClass = (item: InventoryItem) => {
    if (item.quantity_on_hand === 0) return 'out-of-stock';
    if (item.quantity_on_hand <= item.reorder_level) return 'low-stock';
    return 'in-stock';
  };

  if (loading) {
    return <div className="loading">Loading inventory data...</div>;
  }

  return (
    <div className="inventory-dashboard">
      <h1>Inventory Management</h1>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total SKUs</h3>
          <p className="stat-value">{stats.totalItems}</p>
          <span className="stat-label">Unique Products</span>
        </div>

        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p className="stat-value">{stats.lowStockItems}</p>
          <span className="stat-label">Below Reorder Level</span>
        </div>

        <div className="stat-card">
          <h3>Out of Stock</h3>
          <p className="stat-value">{stats.outOfStockItems}</p>
          <span className="stat-label">Need Reordering</span>
        </div>

        <div className="stat-card">
          <h3>Total Quantity</h3>
          <p className="stat-value">{stats.totalQuantity}</p>
          <span className="stat-label">Units on Hand</span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Items ({inventory.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'low' ? 'active' : ''}`}
          onClick={() => setFilterStatus('low')}
        >
          Low Stock ({stats.lowStockItems})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'out' ? 'active' : ''}`}
          onClick={() => setFilterStatus('out')}
        >
          Out of Stock ({stats.outOfStockItems})
        </button>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <h2>Inventory Details</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Inventory ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Reorder Level</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.inventory_id}>
                <td>#{item.inventory_id}</td>
                <td>#{item.product_id}</td>
                <td className="quantity">{item.quantity_on_hand}</td>
                <td>{item.reorder_level}</td>
                <td>{item.warehouse}</td>
                <td>
                  <span className={`status ${getStatusClass(item)}`}>
                    {item.quantity_on_hand === 0
                      ? 'Out of Stock'
                      : item.quantity_on_hand <= item.reorder_level
                      ? 'Low Stock'
                      : 'In Stock'}
                  </span>
                </td>
                <td>{new Date(item.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warehouse Distribution */}
      <div className="warehouse-section">
        <h2>Warehouse Distribution</h2>
        <div className="warehouse-list">
          {Array.from(new Set(inventory.map(item => item.warehouse))).map((warehouse) => {
            const warehouseItems = inventory.filter(item => item.warehouse === warehouse);
            const totalQty = warehouseItems.reduce((sum, item) => sum + item.quantity_on_hand, 0);
            return (
              <div key={warehouse} className="warehouse-card">
                <h3>{warehouse}</h3>
                <p className="warehouse-info">
                  {warehouseItems.length} SKUs | {totalQty} Units
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reorder Recommendations */}
      {stats.lowStockItems > 0 && (
        <div className="reorder-section">
          <h2>Items Requiring Attention</h2>
          <div className="alert-list">
            {inventory
              .filter(item => item.quantity_on_hand <= item.reorder_level)
              .slice(0, 5)
              .map((item) => (
                <div key={item.inventory_id} className="alert-item">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <p className="alert-title">Product #{item.product_id}</p>
                    <p className="alert-message">
                      Current: {item.quantity_on_hand} units | Reorder at: {item.reorder_level} units
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
