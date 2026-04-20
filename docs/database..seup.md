CREATE TABLE app_user (

  user_id         BIGSERIAL PRIMARY KEY,

  full_name       TEXT NOT NULL,

  password_hash   TEXT NOT NULL,

  role            TEXT NOT NULL DEFAULT 'cashier',

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_app_user_role CHECK (role IN ('admin', 'cashier', 'manager', 'viewer'))

);

 

-- ============================================

-- 2) CATEGORY

-- ============================================

CREATE TABLE category (

  category_id   BIGSERIAL PRIMARY KEY,

  name          TEXT NOT NULL UNIQUE,

  description   TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

 

-- ============================================

-- 3) PRODUCT (barcode required + unique; sku removed)

-- ============================================

CREATE TABLE product (

  product_id    BIGSERIAL PRIMARY KEY,

  category_id   BIGINT NOT NULL REFERENCES category(category_id) ON DELETE RESTRICT,

  barcode       TEXT NOT NULL UNIQUE,

  name          TEXT NOT NULL,

  description   TEXT,

  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

 

CREATE INDEX idx_product_category_id ON product(category_id);

 

-- ============================================

-- 4) INVENTORY (1 row per product)

-- ============================================

CREATE TABLE inventory (

  inventory_id       BIGSERIAL PRIMARY KEY,

  product_id         BIGINT NOT NULL UNIQUE REFERENCES product(product_id) ON DELETE CASCADE,

  quantity_on_hand   INTEGER NOT NULL DEFAULT 0,

  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_inventory_qty_nonnegative CHECK (quantity_on_hand >= 0)

);

 

-- ============================================

-- 5) SUPPLIER

-- ============================================

CREATE TABLE supplier (

  supplier_id     BIGSERIAL PRIMARY KEY,

  name            TEXT NOT NULL UNIQUE,

  contact_person  TEXT,

  phone           TEXT,

  email           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

 

-- ============================================

-- 6) PURCHASE

-- ============================================

CREATE TABLE purchase (

  purchase_id   BIGSERIAL PRIMARY KEY,

  supplier_id   BIGINT NOT NULL REFERENCES supplier(supplier_id) ON DELETE RESTRICT,

  user_id       BIGINT NOT NULL REFERENCES app_user(user_id) ON DELETE RESTRICT,

  total_cost    NUMERIC(12,2) NOT NULL DEFAULT 0,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_purchase_total_cost_nonnegative CHECK (total_cost >= 0)

);

 

CREATE INDEX idx_purchase_supplier_id ON purchase(supplier_id);

CREATE INDEX idx_purchase_user_id ON purchase(user_id);

 

-- ============================================

-- 7) PURCHASE ITEM

-- (ERD implies items belong to a purchase; purchase_id is required)

-- ============================================

CREATE TABLE purchase_item (

  purchase_item_id  BIGSERIAL PRIMARY KEY,

  purchase_id       BIGINT NOT NULL REFERENCES purchase(purchase_id) ON DELETE CASCADE,

  product_id        BIGINT NOT NULL REFERENCES product(product_id) ON DELETE RESTRICT,

  quantity          INTEGER NOT NULL,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_purchase_item_qty_positive CHECK (quantity > 0),

  CONSTRAINT uq_purchase_item_purchase_product UNIQUE (purchase_id, product_id)

);

 

CREATE INDEX idx_purchase_item_purchase_id ON purchase_item(purchase_id);

CREATE INDEX idx_purchase_item_product_id ON purchase_item(product_id);

 

-- ============================================

-- 8) SALE (Customer/Cusemer ignored; no customer_id)

-- ============================================

CREATE TABLE sale (

  sale_id           BIGSERIAL PRIMARY KEY,

  user_id           BIGINT NOT NULL REFERENCES app_user(user_id) ON DELETE RESTRICT,

  sale_date         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  subtotal          NUMERIC(12,2) NOT NULL DEFAULT 0,

  discount_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,

  tax_amount        NUMERIC(12,2) NOT NULL DEFAULT 0,

  total_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,

  status            TEXT NOT NULL DEFAULT 'completed',

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_sale_amounts_nonnegative CHECK (

    subtotal >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0

  ),

  CONSTRAINT chk_sale_status CHECK (status IN ('pending', 'completed', 'voided', 'refunded'))

);

 

CREATE INDEX idx_sale_user_id ON sale(user_id);

CREATE INDEX idx_sale_sale_date ON sale(sale_date);

 

-- ============================================

-- 9) SALE ITEM

-- ============================================

CREATE TABLE sale_item (

  sale_item_id     BIGSERIAL PRIMARY KEY,

  sale_id          BIGINT NOT NULL REFERENCES sale(sale_id) ON DELETE CASCADE,

  product_id       BIGINT NOT NULL REFERENCES product(product_id) ON DELETE RESTRICT,

  quantity         INTEGER NOT NULL,

  unit_price       NUMERIC(12,2) NOT NULL,

  discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,

  line_total       NUMERIC(12,2) NOT NULL,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_sale_item_qty_positive CHECK (quantity > 0),

  CONSTRAINT chk_sale_item_amounts_nonnegative CHECK (

    unit_price >= 0 AND discount_amount >= 0 AND line_total >= 0

  )

);

 

CREATE INDEX idx_sale_item_sale_id ON sale_item(sale_id);

CREATE INDEX idx_sale_item_product_id ON sale_item(product_id);

 

-- ============================================

-- 10) PAYMENT (supports multiple payments per sale)

-- ============================================

CREATE TABLE payment (

  payment_id      BIGSERIAL PRIMARY KEY,

  sale_id         BIGINT NOT NULL REFERENCES sale(sale_id) ON DELETE CASCADE,

  payment_method  TEXT NOT NULL,

  amount          NUMERIC(12,2) NOT NULL,

  reference_no    TEXT,

  payment_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_payment_amount_positive CHECK (amount > 0),

  CONSTRAINT chk_payment_method CHECK (payment_method IN ('cash', 'card', 'gcash', 'paymaya', 'bank_transfer', 'other')),

  CONSTRAINT uq_payment_reference_no UNIQUE (reference_no)

);

 

CREATE INDEX idx_payment_sale_id ON payment(sale_id);

 

-- ============================================

-- 11) AUDIT LOG

-- (Manual or trigger-based; stores old/new as JSONB)

-- ============================================

CREATE TABLE audit_log (

  log_id       BIGSERIAL PRIMARY KEY,

  table_name   TEXT NOT NULL,

  record_id    TEXT NOT NULL,

  action       TEXT NOT NULL,

  old_value    JSONB,

  new_value    JSONB,

  changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_audit_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))

);

 

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);

CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);