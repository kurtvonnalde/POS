import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Register from "./components/common/users/Registration/Registration";
import Products from "./pages/Products/Products";
import Sales from "./pages/Sales/Sales";
import Inventory from "./pages/Inventory/Inventory";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

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
