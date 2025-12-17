import axios from "axios";

export const apiUsuarios = axios.create({
  baseURL: "http://localhost:8080",
});

export const UsuariosAPI = {
  login: (email: string, password: string) =>
    apiUsuarios.post("/auth/login", { email, password }),

  register: (user: any) =>
    apiUsuarios.post("/auth/register", user),

  getAll: () =>
    apiUsuarios.get("/users"),

  getById: (id: number) =>
    apiUsuarios.get(`/users/${id}`)
};
