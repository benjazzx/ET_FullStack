import axios from "axios";

export const apiCarrito = axios.create({
  baseURL: "http://localhost:8085",
});

export interface CarritoRequestDTO {
  idUsuario: number;
  idProducto: number;
  cantidad: number;
  precio: number;
}

export const CarritoAPI = {
  obtenerCarrito: (idUsuario: number) =>
    apiCarrito.get(`/carrito/${idUsuario}`),

  agregarProducto: (data: CarritoRequestDTO) =>
    apiCarrito.post("/carrito/agregar", data),

  eliminarItem: (idItem: number) =>
    apiCarrito.delete(`/carrito/eliminar/${idItem}`),

  vaciarCarrito: (idUsuario: number) =>
    apiCarrito.delete(`/carrito/vaciar/${idUsuario}`),

  obtenerTotal: (idUsuario: number) =>
    apiCarrito.get(`/carrito/${idUsuario}/total`),
};
