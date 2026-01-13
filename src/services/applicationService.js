// src/services/applicationService.js

import api from "./api";

const applicationService = {
  getAll: async () => {
    try {
      const response = await api.get("/applications");
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching application ${id}:`, error);
      throw error;
    }
  },

  getByCareer: async (careerId) => {
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

  update: async (id, status, notes) => {
    try {
      const response = await api.patch(`/applications/${id}`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating application ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting application ${id}:`, error);
      throw error;
    }
  },

  downloadResume: async (id) => {
    try {
      const response = await api.get(`/applications/${id}/resume`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading resume for application ${id}:`, error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get("/applications/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching application statistics:", error);
      throw error;
    }
  },
};

export default applicationService;
