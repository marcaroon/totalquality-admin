// src/services/heroService.js
import api from "./api";

export const getHeroes = async () => {
  const response = await api.get("/hero"); // Pastikan baseURL axios mengarah ke Next.js backend
  return response.data;
};

export const createHero = async (formData) => {
  const response = await api.post("/hero", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteHero = async (id) => {
  const response = await api.delete(`/hero/${id}`);
  return response.data;
};
