import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useApiNotifier, useNotifications } from "./";
import { appLogger } from "../../utils/logger";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string | string[]; // Optional: specify required role(s)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { info: showInfo } = useNotifications();
  const { notifyApiError } = useApiNotifier();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      // If no token exists, user is not authenticated
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
          // Token is valid
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          showInfo({
            title: "Session expired",
            message: "Please log in again to continue.",
          });
          setIsAuthenticated(false);
        }
      } catch (err) {
        appLogger.error("Token validation error", err);
        notifyApiError(err, {
          title: "Authentication check failed",
          fallbackMessage: "Unable to verify your session. Please log in again.",
        });
        // On error, assume token is invalid for safety
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // Still validating, show a loading state if needed
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If requiredRole is specified, check if user has the role
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (userRole && !rolesArray.includes(userRole)) {
      return <Navigate to="/products" replace />;
    }
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
