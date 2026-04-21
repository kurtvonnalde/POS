import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/Login";
import Register from "./app/Registration";
import Products from "./app/pages/products/Products";
import Sales from "./app/pages/sales/Sales";
import Inventory from "./app/pages/inventory/Inventory";
import Reports from "./app/pages/reports/Reports";
import Settings from "./app/pages/settings/Settings";
import ProtectedRoute from "./component/ProtectedRoute";
import AppLayout from "./component/AppLayout";
import AuthLayout from "./component/AuthLayout";

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
        path="/auth/register"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Register />
            </AppLayout>
          </ProtectedRoute>
        }
      />
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
              <Settings isSidebarCollapsed={true} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
