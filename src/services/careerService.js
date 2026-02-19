// src/services/careerService.js
import api from "./api";

const careerService = {
  getAll: async () => {
    try {
      const response = await api.get("/careers");
      return response.data; //
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
      const payload = {};
      if (data.title) payload.title = data.title;
      if (data.description) payload.description = data.description;
      if (data.requirements) payload.requirements = data.requirements;
      if (data.location) payload.location = data.location;

      const response = await api.patch(`/careers/${id}`, payload);
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

  getCount: async () => {
    try {
      const response = await api.get("/careers");
      return response.data.data.length;
    } catch (error) {
      console.error("Error fetching career count:", error);
      return 0;
    }
  },
};

export default careerService;
