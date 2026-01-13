// src/services/careerService.js

import api from "./api";

const careerService = {
  getAll: async () => {
    try {
      const response = await api.get("/careers");
      return response.data;
    } catch (error) {
      console.error("Error fetching careers:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/careers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching career ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/careers", data);
      return response.data;
    } catch (error) {
      console.error("Error creating career:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.patch(`/careers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating career ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/careers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting career ${id}:`, error);
      throw error;
    }
  },

  toggleStatus: async (id, status) => {
    try {
      const response = await api.patch(`/careers/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error toggling status for career ${id}:`, error);
      throw error;
    }
  },

  getApplications: async (careerId) => {
    try {
      const response = await api.get(`/applications/career/${careerId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching applications for career ${careerId}:`,
        error
      );
      throw error;
    }
  },

  getCount: async () => {
    try {
      const response = await api.get("/careers/count");
      return response.data.count;
    } catch (error) {
      console.error("Error fetching career count:", error);
      throw error;
    }
  },
};

export default careerService;
