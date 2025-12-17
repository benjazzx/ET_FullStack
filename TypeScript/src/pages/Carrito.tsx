
import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";

import img1 from '../assets/img/images (1).jpeg';
import img2 from '../assets/img/images (2).jpeg';
import img3 from '../assets/img/images (3).jpeg';

const imagenes: Record<string, string> = {
  'images (1).jpeg': img1,
  'images (2).jpeg': img2,
  'images (3).jpeg': img3,
};

const Carrito = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();
  const navigate = useNavigate();

  if (carrito.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Carrito de Compras</h2>
        <p>No hay productos en el carrito</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const prod = (item as any).producto as any | undefined;
              // Mapeo estático para imágenes locales
              let img = prod?.imagen ?? "/assets/img/placeholder.png";
              if (img && imagenes[img]) {
                img = imagenes[img];
              }
              const name = prod?.nombre ?? prod?.name ?? `Producto ${((item as any).idProducto ?? prod?.id) ?? ""}`;
              const price = prod?.precio ?? prod?.price ?? 0;
              const keyId = item.id ?? prod?.id ?? (item as any).idProducto ?? Math.random();
              return (
                <tr key={keyId}>
                  <td>{name}</td>
                  <td>${price}</td>
                  <td>{item.cantidad}</td>
                  <td>${price * item.cantidad}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDelCarrito(item.id ?? prod?.id ?? (item as any).idProducto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <button className="btn btn-warning" onClick={vaciarCarrito}>
            Vaciar Carrito
          </button>
        </div>
        <div className="col-md-6 text-end">
          <h4>Total: ${total}</h4>
          <button
            className="btn btn-success"
            onClick={() => navigate('/checkout')}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;