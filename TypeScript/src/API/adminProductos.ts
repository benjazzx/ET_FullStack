import axios from "axios";

// API para el panel de administración (CRUD) usando el proxy
const ADMIN_PRODUCTS_BASE = "http://localhost:8080/proxy";

export const AdminProductosAPI = {
  getAll: () => axios.get(`${ADMIN_PRODUCTS_BASE}/products`),
  getById: (id: number) => axios.get(`${ADMIN_PRODUCTS_BASE}/products/${id}`),
  create: (data: any) => axios.post(`${ADMIN_PRODUCTS_BASE}/products`, data),
  update: (id: number, data: any) => axios.put(`${ADMIN_PRODUCTS_BASE}/products/${id}`, data),
  delete: (id: number) => axios.delete(`${ADMIN_PRODUCTS_BASE}/products/${id}`),
};
