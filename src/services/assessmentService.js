// src/services/assessmentService.js

import api from "./api";

const assessmentService = {
  getAll: async () => {
    try {
      const response = await api.get("/assessments");
      return response.data;
    } catch (error) {
      console.error("Error fetching assessments:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assessment ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/assessments", data);
      return response.data;
    } catch (error) {
      console.error("Error creating assessment:", error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get("/assessments/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching assessment statistics:", error);
      throw error;
    }
  },
};

export default assessmentService;
