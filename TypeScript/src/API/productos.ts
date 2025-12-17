import axios from "axios";

const PRODUCTS_BASE = (import.meta as any).env?.VITE_PRODUCTS_BASE || "http://localhost:8082";

export const ProductosAPI = {
  getAll: () => axios.get(`${PRODUCTS_BASE}/products`),
  getById: (id: number) => axios.get(`${PRODUCTS_BASE}/products/${id}`),
  create: (data: any) => axios.post(`${PRODUCTS_BASE}/products`, data),
  update: (id: number, data: any) => axios.put(`${PRODUCTS_BASE}/products/${id}`, data),
  delete: (id: number) => axios.delete(`${PRODUCTS_BASE}/products/${id}`),
};
