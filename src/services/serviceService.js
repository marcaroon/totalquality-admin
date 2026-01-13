// src\services\serviceService.js

import api from './api';

const serviceService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      let imageUrl = data.image;
      
      if (data.imageFile) {
        imageUrl = await serviceService.uploadImage(data.imageFile);
      }
      
      const response = await api.post('/services', {
        title: data.title,
        description: data.description,
        image: imageUrl,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      let imageUrl = data.image;
      
      // If imageFile exists, upload it first
      if (data.imageFile) {
        imageUrl = await serviceService.uploadImage(data.imageFile);
      }
      
      const response = await api.patch(`/services/${id}`, {
        title: data.title,
        description: data.description,
        image: imageUrl,
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  },
};

export default serviceService;