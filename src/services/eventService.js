// src/services/eventService.js

import api from "./api";

const eventService = {
  // Upload image file
  // folder: "events" untuk headline, bisa juga "events" untuk inline (dibedakan di backend oleh nama folder saja)
  uploadImage: async (file, folder = "events") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

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

  // Get all events
  getAll: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Get event by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  // Create new event
  create: async (data) => {
    try {
      let imageUrl = data.image;

      if (data.imageFile) {
        imageUrl = await eventService.uploadImage(data.imageFile, "events");
      }

      const response = await api.post("/events", {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        image: imageUrl,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Update event
  update: async (id, data) => {
    try {
      let imageUrl = data.image;

      if (data.imageFile) {
        imageUrl = await eventService.uploadImage(data.imageFile, "events");
      }

      const response = await api.patch(`/events/${id}`, {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        image: imageUrl,
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },

  // Delete event
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },
};

export default eventService;