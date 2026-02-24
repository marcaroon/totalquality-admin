// src/services/newsService.js

import api from "./api";

const newsService = {
  // Upload image file — folder "news" agar terpisah dari events dan services
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "news");

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Get all news
  getAll: async () => {
    try {
      const response = await api.get("/news");
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  // Get news by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error);
      throw error;
    }
  },

  // Create new news
  create: async (data) => {
    try {
      let imageUrl = data.image;

      // Jika ada file gambar, upload dulu baru kirim URL-nya
      if (data.imageFile) {
        imageUrl = await newsService.uploadImage(data.imageFile);
      }

      const response = await api.post("/news", {
        title: data.title,
        content: data.content,
        author: data.author || undefined,
        image: imageUrl || undefined,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  },

  // Update news
  update: async (id, data) => {
    try {
      let imageUrl = data.image;

      // Jika ada file gambar baru, upload dulu
      if (data.imageFile) {
        imageUrl = await newsService.uploadImage(data.imageFile);
      }

      const payload = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.content !== undefined) payload.content = data.content;
      if (data.author !== undefined) payload.author = data.author;
      if (imageUrl !== undefined) payload.image = imageUrl;

      const response = await api.patch(`/news/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating news ${id}:`, error);
      throw error;
    }
  },

  // Delete news
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