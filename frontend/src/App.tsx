import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Products from "./pages/Products/Products";
import Sales from "./pages/Sales/Sales";
import Inventory from "./pages/Inventory/Inventory";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Purchase from "./pages/Purchase/Purchase";
import PurchaseHistory from "./pages/PurchaseHistory/PurchaseHistory";
import SupplierOrders from "./pages/SupplierOrders/SupplierOrders";
import AppLayout from "./components/layout/AppLayout/AppLayout";
import { ProtectedRoute } from "./components/common";
import { AuthLayout } from "./components/layout";

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/products" replace />} />

      {/* Public routes (no header/footer) */}
      <Route
        path="/auth/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      {/* Protected routes (with header/footer) */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Products />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Sales />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Inventory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Purchase />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase-history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PurchaseHistory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier-orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SupplierOrders />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRole={["manager", "admin"]}>
            <AppLayout>
              <Reports />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
