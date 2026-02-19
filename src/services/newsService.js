// src/services/newsService.js
import api from "./api";

const newsService = {
  getAll: async () => {
    try {
      const response = await api.get("/news");
      return response.data; //
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        author: data.author,
        image: data.image,
      };

      const response = await api.post("/news", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const payload = {};
      if (data.title) payload.title = data.title;
      if (data.content) payload.content = data.content;
      if (data.author) payload.author = data.author;
      if (data.image) payload.image = data.image;

      // Backend tidak menerima 'summary' atau 'published'

      const response = await api.patch(`/news/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating news ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting news ${id}:`, error);
      throw error;
    }
  },
};

export default newsService;
