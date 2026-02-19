// src/services/forumService.js
import api from "./api";

const forumService = {
  getAll: async () => {
    try {
      const response = await api.get("/forums");
      return response.data; //
    } catch (error) {
      console.error("Error fetching forums:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/forums/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching forum ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/forums", {
        quote: data.quote,
        author: data.author,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating forum:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const payload = {};
      if (data.quote) payload.quote = data.quote;
      if (data.author) payload.author = data.author;

      const response = await api.patch(`/forums/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating forum ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/forums/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting forum ${id}:`, error);
      throw error;
    }
  },

  like: async (id) => {
    try {
      const response = await api.post(`/forums/${id}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking forum ${id}:`, error);
      throw error;
    }
  },

  unlike: async (id) => {
    try {
      const response = await api.post(`/forums/${id}/unlike`);
      return response.data;
    } catch (error) {
      console.error(`Error unliking forum ${id}:`, error);
      throw error;
    }
  },

  share: async (id) => {
    try {
      const response = await api.post(`/forums/${id}/share`);
      return response.data;
    } catch (error) {
      console.error(`Error sharing forum ${id}:`, error);
      throw error;
    }
  },
};

export default forumService;