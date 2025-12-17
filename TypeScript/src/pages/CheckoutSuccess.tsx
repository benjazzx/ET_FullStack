import { useLocation, Link } from "react-router-dom";

const CheckoutSuccess = () => {
  const location = useLocation();
  const order = (location.state as any)?.order || (() => {
    try { return JSON.parse(sessionStorage.getItem("lastOrder") || "null"); } catch { return null; }
  })();

  return (
    <div className="container mt-4">
      <h2 className="text-success">¡Compra exitosa!</h2>
      <p>Tu orden se ha procesado correctamente.</p>

      {order ? (
        <div className="card p-3">
          <h5>Resumen de la orden #{order.id}</h5>
          <p><strong>Cliente:</strong> {order.nombre} — {order.email}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <h6>Productos:</h6>
          <ul>
            {order.items.map((it: any) => (
              <li key={it.producto.id}>{it.producto.nombre} x {it.cantidad} — ${it.producto.precio * it.cantidad}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No se encontró el resumen de la orden.</p>
      )}

      <div className="mt-3">
        <Link to="/productos" className="btn btn-primary me-2">Seguir comprando</Link>
        <Link to="/" className="btn btn-outline-secondary">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
