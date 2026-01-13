// src/components/ProtectedRoute.jsx

import React, { useEffect, useState } from "react";
import authService from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        window.location.href = "/login";
        return;
      }

      if (!authService.isAdmin()) {
        alert("Access denied. Admin privileges required.");
        authService.logout();
        return;
      }

      const isValid = await authService.verifyToken();

      if (!isValid) {
        window.location.href = "/login";
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = "/login";
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
