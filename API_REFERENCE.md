# POS API Reference Guide

Base URL: `http://localhost:8000`

## Products API

### Create Product
```
POST /products/
Content-Type: application/json

{
  "category_id": 1,
  "barcode": "123456789",
  "name": "Product Name",
  "description": "Description",
  "sku": "SKU-001",
  "unit_price": 29.99,
  "is_active": true
}
```

### Get All Products
```
GET /products/
```

### Get Product by ID
```
GET /products/{product_id}
```

### Get Products by Category
```
GET /products/category/{category_id}
```

### Update Product
```
PATCH /products/{product_id}
Content-Type: application/json

{
  "name": "Updated Name",
  "unit_price": 35.99,
  "is_active": true
}
```

### Delete Product
```
DELETE /products/{product_id}
```

---

## Inventory API

### Create Inventory
```
POST /inventory/
Content-Type: application/json

{
  "product_id": 1,
  "quantity_on_hand": 100,
  "reorder_level": 20,
  "warehouse": "Main"
}
```

### Get All Inventory
```
GET /inventory/
```

### Get Low Stock Items
```
GET /inventory/low-stock
```

### Get Inventory by ID
```
GET /inventory/{inventory_id}
```

### Get Inventory by Product
```
GET /inventory/product/{product_id}
```

### Update Inventory
```
PATCH /inventory/{inventory_id}
Content-Type: application/json

{
  "quantity_on_hand": 85,
  "reorder_level": 25
}
```

---

## Sales API

### Create Sale with Items
```
POST /sales/
Content-Type: application/json

{
  "user_id": 1,
  "discount_amount": 5.00,
  "tax_amount": 7.50,
  "sale_items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 29.99,
      "discount_amount": 0.00
    },
    {
      "product_id": 2,
      "quantity": 1,
      "unit_price": 49.99,
      "discount_amount": 5.00
    }
  ]
}
```

### Get All Sales
```
GET /sales/
```

### Get Sale by ID
```
GET /sales/{sale_id}
```

### Get Sales by Date Range
```
GET /sales/date-range/stats?start_date=2024-01-01&end_date=2024-01-31
```

### Get Daily Sales Total
```
GET /sales/daily-stats/2024-01-15
```

### Get Monthly Sales Total
```
GET /sales/monthly-stats/2024/1
```

### Get Top Products
```
GET /sales/analytics/top-products?limit=10
```

### Update Sale Status
```
PATCH /sales/{sale_id}
Content-Type: application/json

{
  "status": "completed"
}
```

---

## Payments API

### Create Payment
```
POST /payments/
Content-Type: application/json

{
  "sale_id": 1,
  "payment_method": "card",
  "amount": 82.49,
  "reference_no": "TXN123456",
  "currency": "USD"
}
```

### Get All Payments
```
GET /payments/
```

### Get Payment by ID
```
GET /payments/{payment_id}
```

### Get Payments by Sale
```
GET /payments/sale/{sale_id}
```

### Update Payment
```
PATCH /payments/{payment_id}
Content-Type: application/json

{
  "payment_method": "cash",
  "amount": 85.00
}
```

### Delete Payment
```
DELETE /payments/{payment_id}
```

---

## Purchases API

### Create Purchase with Items
```
POST /purchases/
Content-Type: application/json

{
  "supplier_id": 1,
  "user_id": 1,
  "purchase_items": [
    {
      "product_id": 1,
      "quantity": 50,
      "unit_cost": 15.00
    },
    {
      "product_id": 2,
      "quantity": 30,
      "unit_cost": 25.00
    }
  ]
}
```

### Get All Purchases
```
GET /purchases/
```

### Get Purchase by ID
```
GET /purchases/{purchase_id}
```

### Get Purchases by Supplier
```
GET /purchases/supplier/{supplier_id}
```

### Get Pending Purchases
```
GET /purchases/status/pending
```

### Update Purchase Status
```
PATCH /purchases/{purchase_id}
Content-Type: application/json

{
  "status": "completed"
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200 OK** - Successful GET/PATCH request
- **201 Created** - Successful POST request
- **204 No Content** - Successful DELETE request
- **400 Bad Request** - Invalid input data
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error response format:
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Common Response Examples

### Product Response
```json
{
  "product_id": 1,
  "category_id": 1,
  "barcode": "123456789",
  "name": "Product Name",
  "description": "Description",
  "sku": "SKU-001",
  "unit_price": 29.99,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Sale Response
```json
{
  "sale_id": 1,
  "user_id": 1,
  "sale_date": "2024-01-15T14:30:00",
  "subtotal": 109.97,
  "discount_amount": 5.00,
  "tax_amount": 7.50,
  "total_amount": 112.47,
  "status": "completed",
  "created_at": "2024-01-15T14:30:00",
  "updated_at": "2024-01-15T14:30:00"
}
```

### Inventory Response
```json
{
  "inventory_id": 1,
  "product_id": 1,
  "quantity_on_hand": 85,
  "reorder_level": 20,
  "warehouse": "Main",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

## Authentication

Note: Add authentication headers to all requests once auth is implemented:

```
Authorization: Bearer {token}
```

---

## Testing with cURL

### Create a product:
```bash
curl -X POST http://localhost:8000/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "barcode": "123456789",
    "name": "Test Product",
    "sku": "TEST-001",
    "unit_price": 29.99,
    "is_active": true
  }'
```

### Get all products:
```bash
curl http://localhost:8000/products/
```

### Create an inventory:
```bash
curl -X POST http://localhost:8000/inventory/ \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_on_hand": 100,
    "reorder_level": 20,
    "warehouse": "Main"
  }'
```

### Create a sale:
```bash
curl -X POST http://localhost:8000/sales/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "discount_amount": 0,
    "tax_amount": 5.00,
    "sale_items": [
      {
        "product_id": 1,
        "quantity": 2,
        "unit_price": 29.99,
        "discount_amount": 0
      }
    ]
  }'
```
