import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string | string[]; // Optional: specify required role(s)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
        const response = await fetch("http://localhost:8000/auth/verify", {
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
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // On error, assume token is invalid for safety
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // Show loading state while validating
  if (isAuthenticated === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <h1>Access Denied</h1>
            <p>You do not have permission to access this page.</p>
            <p>Your role: <strong>{userRole}</strong></p>
          </div>
        </div>
      );
    }
  }

  // If authenticated, show the protected content
  return children;
};

export default ProtectedRoute;
