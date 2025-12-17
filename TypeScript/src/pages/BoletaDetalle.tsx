import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BoletaAPI } from "../API/boleta";

const BoletaDetalle = () => {
  const { id } = useParams();
  const { state } = useLocation();

  const [boleta, setBoleta] = useState(state?.boleta || null);

  // Si el usuario refresca, debemos cargar desde el backend
  useEffect(() => {
    if (!boleta && id) {
      BoletaAPI.obtenerPorUsuario(Number(localStorage.getItem("userId")))
        .then((res) => {
          const lista = res.data;
          const encontrada = lista.find((b: any) => b.id == id);
          setBoleta(encontrada);
        })
        .catch((err) => console.error("Error cargando boleta:", err));
    }
  }, [boleta, id]);

  if (!boleta) return <div className="container mt-4">Cargando boleta...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Boleta #{boleta.id}</h2>

      <p><strong>Fecha:</strong> {boleta.fechaEmision ? new Date(boleta.fechaEmision).toLocaleString() : (boleta.fecha ? new Date(boleta.fecha).toLocaleString() : "-")}</p>
      <p><strong>Usuario:</strong> {boleta.idUsuario}</p>

      <h4 className="mt-4">Productos</h4>
      <ul className="list-group mb-3">
        {boleta.items.map((item: any, idx: number) => (
          <li
            key={item.idProducto || idx}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {item.nombreProducto || item.nombre || `Producto #${item.idProducto}`} x {item.cantidad}
              <span className="text-muted small ms-2">@ ${item.precioUnitario}</span>
            </span>
            <strong>${(item.precioUnitario * item.cantidad).toLocaleString()}</strong>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <h4>Total pagado: ${boleta.total}</h4>
      </div>
    </div>
  );
};

export default BoletaDetalle;
