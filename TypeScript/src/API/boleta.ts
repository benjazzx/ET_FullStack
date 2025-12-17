import axios from "axios";

export const apiBoleta = axios.create({
  baseURL: "http://localhost:8083",
});

export const BoletaAPI = {
  generar: (idUsuario: number) =>
    apiBoleta.post(`/boletas/generar/${idUsuario}`),

  obtenerPorUsuario: (idUsuario: number) =>
    apiBoleta.get(`/boletas/usuario/${idUsuario}`),
};
