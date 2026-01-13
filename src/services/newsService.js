// src/services/newsService.js

import api from "./api";

const newsService = {
  getAll: async () => {
    try {
      const response = await api.get("/news");
      return response.data;
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
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("summary", data.summary);
      formData.append("content", data.content);
      formData.append("author", data.author);
      formData.append("published", data.published.toString());
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      } else if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.post("/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.summary) formData.append("summary", data.summary);
      if (data.content) formData.append("content", data.content);
      if (data.author) formData.append("author", data.author);
      if (data.published !== undefined) formData.append("published", data.published.toString());
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      } else if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.patch(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  togglePublish: async (id, published) => {
    try {
      const response = await api.patch(`/news/${id}`, { published });
      return response.data;
    } catch (error) {
      console.error(`Error toggling publish for news ${id}:`, error);
      throw error;
    }
  },
};

export default newsService;