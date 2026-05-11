import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, BarcodeScanner } from "../../components/common";
import { Grid, Check, Pause } from "lucide-react";
import "./Purchase.scss";

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
}

interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
}

export default function Purchase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [taxRate, setTaxRate] = useState(10);
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "cheque" | "online">("cash");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products/`);
      setProducts(res.data.filter((p: Product) => p.is_active));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/category/`);
      setCategories([{ category_id: null, name: "All Categories" }, ...res.data]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product_id === product.product_id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? {
                ...item,
                quantity: item.quantity + 1,
                line_total: (item.quantity + 1) * item.unit_price - item.discount_amount,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          quantity: 1,
          unit_price: product.unit_price,
          discount_amount: 0,
          line_total: product.unit_price,
        },
      ]);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/barcode/${barcode}`);
      handleAddToCart(res.data);
    } catch (err) {
      alert(`Product with barcode ${barcode} not found`);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product_id !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
                line_total: quantity * item.unit_price - item.discount_amount,
              }
            : item
        )
      );
    }
  };

  const handleUpdateDiscount = (productId: number, discount: number) => {
    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              discount_amount: discount,
              line_total: item.quantity * item.unit_price - discount,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const handleProceed = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setCheckoutMode(true);
    } catch (err) {
      console.error("Error proceeding to checkout:", err);
      alert("Failed to proceed");
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const subtotal = cart.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price - item.discount_amount);
      }, 0);
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      // Create sale
      const saleRes = await axios.post(`${API_BASE_URL}/sales/`, {
        user_id: 1, // Default user, should be from auth
        subtotal,
        discount_amount: cart.reduce((sum, item) => sum + item.discount_amount, 0),
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: "completed",
        sale_items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          line_total: item.line_total,
        })),
      });

      // Create payment
      await axios.post(`${API_BASE_URL}/purchases/`, {
        sale_id: saleRes.data.sale_id,
        payment_method: paymentMethod,
        amount: totalAmount,
        reference_no: `SL${Date.now()}`,
        currency: "USD",
      });

      alert("Order completed successfully!");
      setCart([]);
      setCheckoutMode(false);
      setPaymentMethod("cash");
    } catch (err) {
      console.error("Error completing order:", err);
      alert("Failed to complete order");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price - item.discount_amount);
  }, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="purchase-page">
      <div className="purchase-container">
        <div className="purchase-main">
          {/* Products Section */}
          <div className="products-section">
            <div className="products-header">
              <h1>
                <Grid size={24} />
                Product Selection
              </h1>
              <div className="products-controls">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="category-filter"
                >
                  {categories.map((cat) => (
                    <option key={cat.category_id || "all"} value={cat.category_id || ""}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-grid">
                {filteredProducts.length === 0 ? (
                  <div className="no-products">No products found</div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="product-card"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="product-card-inner">
                        <div className="product-image">
                          <div className="placeholder-icon">📦</div>
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="sku">SKU: {product.sku}</p>
                          <p className="barcode">Barcode: {product.barcode}</p>
                          <p className="price">${product.unit_price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <BarcodeScanner
              enabled={scannerEnabled}
              onScan={handleBarcodeScanned}
            />

            <ShoppingCart
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateDiscount={handleUpdateDiscount}
              onRemoveItem={handleRemoveItem}
              taxRate={taxRate}
            />

            <div className="checkout-controls">
              <div className="tax-control">
                <label htmlFor="tax-rate">Tax Rate (%):</label>
                <input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="tax-input"
                />
              </div>

              {!checkoutMode ? (
                <div className="action-buttons">
                  <button className="hold-btn" title="Hold this order for later">
                    <Pause size={18} />
                    Hold Order
                  </button>
                  <button
                    className="proceed-btn"
                    onClick={handleProceed}
                    disabled={cart.length === 0}
                  >
                    <Check size={18} />
                    Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div className="checkout-form">
                  <h3>Complete Purchase</h3>

                  <div className="checkout-summary">
                    <div className="summary-item">
                      <span>Subtotal:</span>
                      <strong>${subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Tax ({taxRate}%):</span>
                      <strong>${taxAmount.toFixed(2)}</strong>
                    </div>
                    <div className="summary-item total">
                      <span>Total:</span>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="payment-method">Payment Method:</label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="payment-select"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online Transfer</option>
                    </select>
                  </div>

                  <div className="checkout-buttons">
                    <button
                      className="confirm-btn"
                      onClick={handleCompleteOrder}
                    >
                      <Check size={18} />
                      Confirm Order
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setCheckoutMode(false);
                        setPaymentMethod("cash");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
