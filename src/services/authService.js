// src/services/authService.js

import api from "./api";

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;

        if (user.role !== "admin") {
          throw new Error("Access denied. Admin privileges required.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return { user, token };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }

      throw new Error(error.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data.success;
    } catch (error) {
      console.error("Token verification failed:", error);
      authService.logout();
      return false;
    }
  },
};

export default authService;
