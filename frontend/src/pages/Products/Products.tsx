import { useEffect, useState } from 'react';
import './Products.scss';

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

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalValue: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/products/`);
      const data = await response.json();
      setProducts(data);

      // Calculate statistics
      let activeCount = 0;
      let inactiveCount = 0;
      let totalValue = 0;

      data.forEach((product: Product) => {
        if (product.is_active) {
          activeCount++;
        } else {
          inactiveCount++;
        }
        totalValue += product.unit_price;
      });

      setStats({
        totalProducts: data.length,
        activeProducts: activeCount,
        inactiveProducts: inactiveCount,
        totalValue
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-dashboard">
      <h1>Products Management</h1>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
          <span className="stat-label">All Products</span>
        </div>

        <div className="stat-card">
          <h3>Active Products</h3>
          <p className="stat-value">{stats.activeProducts}</p>
          <span className="stat-label">Currently Available</span>
        </div>

        <div className="stat-card">
          <h3>Inactive Products</h3>
          <p className="stat-value">{stats.inactiveProducts}</p>
          <span className="stat-label">Discontinued</span>
        </div>

        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <p className="stat-value">${stats.totalValue.toFixed(2)}</p>
          <span className="stat-label">Combined Value</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, barcode, or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="search-results">Found {filteredProducts.length} products</p>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <h2>Products List</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>Unit Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice(0, 20).map((product) => (
              <tr key={product.product_id}>
                <td>#{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.barcode}</td>
                <td>${product.unit_price.toFixed(2)}</td>
                <td>#{product.category_id}</td>
                <td>
                  <span className={`status ${product.is_active ? 'active' : 'inactive'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(product.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Distribution by Price */}
      <div className="price-distribution">
        <h2>Price Distribution</h2>
        <div className="price-ranges">
          <div className="price-range">
            <span className="range-label">Under $10</span>
            <span className="range-count">
              {products.filter(p => p.unit_price < 10).length} products
            </span>
          </div>
          <div className="price-range">
            <span className="range-label">$10 - $50</span>
            <span className="range-count">
              {products.filter(p => p.unit_price >= 10 && p.unit_price < 50).length} products
            </span>
          </div>
          <div className="price-range">
            <span className="range-label">$50 - $100</span>
            <span className="range-count">
              {products.filter(p => p.unit_price >= 50 && p.unit_price < 100).length} products
            </span>
          </div>
          <div className="price-range">
            <span className="range-label">Over $100</span>
            <span className="range-count">
              {products.filter(p => p.unit_price >= 100).length} products
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
