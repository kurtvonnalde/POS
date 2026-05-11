import { Trash2, Plus, Minus } from "lucide-react";
import "./ShoppingCart.scss";

export interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onUpdateDiscount: (productId: number, discount: number) => void;
  onRemoveItem: (productId: number) => void;
  taxRate?: number;
}

export default function ShoppingCart({
  items,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemoveItem,
  taxRate = 0,
}: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price - item.discount_amount);
  }, 0);

  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <span className="item-count">{items.length} items</span>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product_id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p className="item-sku">SKU: {item.sku}</p>
                <p className="item-barcode">Barcode: {item.barcode}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                  className="qty-btn"
                  title="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateQuantity(item.product_id, parseInt(e.target.value) || 1)
                  }
                  className="qty-input"
                />
                <button
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                  className="qty-btn"
                  title="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="item-price">
                <p className="unit-price">${item.unit_price.toFixed(2)}</p>
                <p className="line-price">${(item.quantity * item.unit_price).toFixed(2)}</p>
              </div>

              <div className="item-discount">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.discount_amount}
                  onChange={(e) =>
                    onUpdateDiscount(item.product_id, parseFloat(e.target.value) || 0)
                  }
                  placeholder="Discount"
                  className="discount-input"
                />
              </div>

              <div className="item-total">
                ${item.line_total.toFixed(2)}
              </div>

              <button
                onClick={() => onRemoveItem(item.product_id)}
                className="remove-btn"
                title="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span className="amount">${subtotal.toFixed(2)}</span>
        </div>
        {taxRate > 0 && (
          <div className="summary-row">
            <span>Tax ({taxRate}%):</span>
            <span className="amount">${taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total:</span>
          <span className="amount">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
