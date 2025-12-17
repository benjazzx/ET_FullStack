import { useLocation, Link } from "react-router-dom";

const CheckoutFail = () => {
  const location = useLocation();
  const order = (location.state as any)?.order || (() => {
    try { return JSON.parse(sessionStorage.getItem("lastOrder") || "null"); } catch { return null; }
  })();

  return (
    <div className="container mt-4">
      <h2 className="text-danger">Pago fallido</h2>
      <p>No pudimos procesar el pago. Puedes reintentar o contactar soporte.</p>

      {order ? (
        <div className="card p-3 mb-3">
          <h5>Resumen de la orden #{order.id}</h5>
          <p><strong>Total:</strong> ${order.total}</p>
          <h6>Productos:</h6>
          <ul>
            {order.items.map((it: any) => (
              <li key={it.producto.id}>{it.producto.nombre} x {it.cantidad} — ${it.producto.precio * it.cantidad}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <Link to="/checkout" className="btn btn-primary me-2">Reintentar pago</Link>
        <Link to="/contacto" className="btn btn-outline-secondary">Contactar soporte</Link>
      </div>
    </div>
  );
};

export default CheckoutFail;
