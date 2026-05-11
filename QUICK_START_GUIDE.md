# POS System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Backend running: `http://localhost:8000`
- Frontend running: `http://localhost:5173`
- Logged in as user with appropriate permissions

---

## 📍 Navigation

### Access Purchase Page
**Option 1**: Click "Purchase" in sidebar
**Option 2**: Direct URL: `http://localhost:5173/purchase`

### Access Product Management
**Path**: Settings → Manage Products tab

---

## 💳 POS Purchase Workflow

### Step 1: Select Products
```
Product Selection (Left Panel)
├─ Search by name/SKU/barcode
├─ Filter by category
└─ Click product to add to cart
```

### Step 2: Use Barcode Scanner (Optional)
```
Click "Scanner ON" button
├─ Input field appears
├─ Place focus on input
├─ Scan barcode
└─ Press Enter to add product
```

### Step 3: Manage Cart
```
Shopping Cart (Right Panel)
├─ Adjust quantity with +/- buttons
├─ Enter discount amount per item
├─ Adjust tax rate at bottom
└─ Cart totals update automatically
```

### Step 4: Complete Purchase
```
Two-Step Checkout:

Button Panel:
├─ "Hold Order" - Save for later
└─ "Proceed to Checkout" - Next step

Checkout Form:
├─ Review totals (subtotal + tax)
├─ Select payment method:
│  ├─ Cash
│  ├─ Credit/Debit Card
│  ├─ Cheque
│  └─ Online Transfer
├─ Click "Confirm Order"
└─ Order saved, inventory decremented
```

---

## 📦 Product Management

### Add Product
1. Go to Settings → Manage Products
2. Click "Add Product" button
3. Fill form:
   - Product Name *
   - Category * (dropdown)
   - SKU * (unique)
   - Barcode * (unique)
   - Unit Price *
   - Description (optional)
   - Active (checkbox)
4. Click "Save Product"

### Edit Product
1. Go to Settings → Manage Products
2. Search/find product
3. Click edit icon (pencil)
4. Modify fields
5. Click "Save Product"

### Delete Product
1. Go to Settings → Manage Products
2. Find product
3. Click delete icon (trash)
4. Confirm deletion

### Search Products
- By name: "iPhone"
- By SKU: "SKU123"
- By barcode: "8901234567890"

---

## 🔧 Barcode Scanner Tips

### Enable/Disable
- Click "Scanner ON/OFF" button at top of cart section
- Green button = Active
- Gray button = Inactive

### How to Scan
1. Click button to enable scanner
2. Input field appears automatically
3. Keep focus on input field
4. Scan barcode with device
5. Press Enter (usually automatic)
6. Product adds to cart

### Troubleshooting
- Product not found: "Product with barcode XXX not found"
- Make sure barcode exists in system
- Check Product Management for correct barcode

---

## 💰 Tax Calculation

### Manual Tax Rate Adjustment
1. In cart section, find "Tax Rate" input
2. Enter percentage (e.g., 10 for 10%)
3. Cart total updates automatically
4. Formula: `Total = Subtotal + (Subtotal × Tax%)`

### Example
```
Item 1: $100 × 2 qty = $200
Item 2: $50 × 1 qty = $50
Subtotal = $250

Discount on Item 1: -$10
Cart Subtotal = $240

Tax Rate: 10%
Tax Amount = $240 × 10% = $24
Final Total = $240 + $24 = $264
```

---

## 📊 Order Confirmation

### After Clicking "Confirm Order"
1. API calls create:
   - Sale record (transaction)
   - Payment record (with method)
   - Sale items (line items)
2. Inventory automatically decrements
3. Success message appears
4. Cart clears automatically
5. Ready for next order

### View Order
- Check Sales dashboard for new sale
- Check Inventory page for stock changes

---

## ⚠️ Common Issues & Solutions

### "Product not found"
**Problem**: Trying to add non-existent product
**Solution**: 
- Check product exists in Settings → Manage Products
- Verify barcode is correct
- Ensure product is marked as "Active"

### "Failed to save product"
**Problem**: Product management form error
**Solution**:
- Ensure all required fields (*) are filled
- SKU must be unique
- Barcode must be unique
- Refresh and try again

### Cart not updating
**Problem**: Quantities or discounts not calculating
**Solution**:
- Refresh the page
- Check browser console for errors
- Verify backend is running

### Inventory not decremented
**Problem**: Inventory stays same after order
**Solution**:
- Verify order was completed (check Sales page)
- Check backend logs for errors
- Ensure inventory records exist for products

---

## 🎨 UI Guide

### Color Meanings
- **Purple Gradient**: Primary buttons/headers
- **Green**: Success/Active status
- **Orange**: Hold/Warning actions
- **Red**: Delete/Danger actions
- **Blue**: Edit/Info actions

### Button States
- **Enabled**: Full color, clickable
- **Disabled**: Faded, not clickable
- **Hover**: Slightly elevated, shadow effect

---

## 📱 Mobile Usage

### Landscape Layout (Recommended)
- Product grid: Left side
- Cart: Right side
- Buttons: Below cart

### Portrait Layout
- Products hidden, toggle to show
- Full-width cart
- Buttons below cart

### Touch Tips
- Larger touch targets
- Double-tap products to add
- Swipe to scroll products

---

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter (in barcode field) | Scan barcode |
| Tab | Navigate between fields |
| Esc | Close modals |
| Click product | Add to cart |

---

## 📞 Support

### Debugging
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Look for 404/500 status codes

### Backend Logs
```bash
Check terminal where backend runs for:
- Request logs
- Database errors
- Validation errors
```

### Frontend Logs
```javascript
// In browser console
// Check for API response errors
console.log(error)
```

---

## ✅ Verification Checklist

- [ ] Backend API responding (visit http://localhost:8000/docs)
- [ ] Frontend loads Purchase page
- [ ] Products display in grid
- [ ] Can search/filter products
- [ ] Can add products to cart
- [ ] Barcode scanner works
- [ ] Cart totals calculate correctly
- [ ] Tax rate adjusts total
- [ ] Checkout form appears
- [ ] Order completes successfully
- [ ] Inventory decrements after order

---

**Last Updated**: Current Implementation
**Version**: 1.0 - Complete
