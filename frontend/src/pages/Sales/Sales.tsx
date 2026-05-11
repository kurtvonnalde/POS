import { useEffect, useState } from 'react';
import './Sales.scss';

interface SalesStats {
  totalSales: number;
  todaySales: number;
  monthSales: number;
  topProducts: any[];
}

interface SaleItem {
  sale_id: number;
  user_id: number;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Sales() {
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    todaySales: 0,
    monthSales: 0,
    topProducts: []
  });
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Fetch all sales
      const salesResponse = await fetch(`${apiUrl}/sales/`);
      const salesData = await salesResponse.json();
      setSales(salesData);

      // Calculate stats
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      let totalSales = 0;
      let todaySales = 0;
      let monthSales = 0;

      salesData.forEach((sale: SaleItem) => {
        totalSales += sale.total_amount;
        
        const saleDate = new Date(sale.sale_date);
        if (saleDate.toISOString().split('T')[0] === today) {
          todaySales += sale.total_amount;
        }
        
        if (saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear) {
          monthSales += sale.total_amount;
        }
      });

      // Fetch top products
      const topResponse = await fetch(`${apiUrl}/sales/analytics/top-products?limit=5`);
      const topProductsData = await topResponse.json();

      setStats({
        totalSales,
        todaySales,
        monthSales,
        topProducts: topProductsData
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">${stats.totalSales.toFixed(2)}</p>
          <span className="stat-label">All Time</span>
        </div>
        
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <p className="stat-value">${stats.todaySales.toFixed(2)}</p>
          <span className="stat-label">Current Day</span>
        </div>
        
        <div className="stat-card">
          <h3>Monthly Sales</h3>
          <p className="stat-value">${stats.monthSales.toFixed(2)}</p>
          <span className="stat-label">Current Month</span>
        </div>
        
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">{sales.length}</p>
          <span className="stat-label">Number of Sales</span>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="sales-table-container">
        <h2>Recent Sales</h2>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.slice(0, 10).map((sale) => (
              <tr key={sale.sale_id}>
                <td>#{sale.sale_id}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                <td>${sale.subtotal.toFixed(2)}</td>
                <td>${sale.discount_amount.toFixed(2)}</td>
                <td>${sale.tax_amount.toFixed(2)}</td>
                <td><strong>${sale.total_amount.toFixed(2)}</strong></td>
                <td>
                  <span className={`status ${sale.status}`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <div className="top-products-container">
          <h2>Top Selling Products</h2>
          <div className="products-list">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <span className="rank">#{index + 1}</span>
                <div className="product-info">
                  <p className="product-id">Product ID: {product[0]}</p>
                  <p className="product-quantity">Units Sold: {product[1]}</p>
                  <p className="product-revenue">Revenue: ${parseFloat(product[2]).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
