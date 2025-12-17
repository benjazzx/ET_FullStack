import { useState, useEffect } from "react";
import { validarNombre, validarCorreo, validarContrasena, validarTelefono, validarDireccion, validarNoVacio } from "../utils/validaciones";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { BoletaAPI } from "../API/boleta";

const Checkout = () => {
  const { carrito, vaciarCarrito } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  // Estados para errores de validación
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [envio, setEnvio] = useState<"standard" | "express">("standard");
  // Estado para mostrar modal y mensaje
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [boletaId, setBoletaId] = useState<number|null>(null);

  const idUsuario = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!idUsuario) {
      alert("Debes iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    if (user) {
      setEmail(user.email);
      const nameFromEmail = user.email.split("@")[0] || "";
      setNombre(nameFromEmail);
    }
  }, [user, idUsuario, navigate]);

  const subtotal = carrito.reduce((sum, item) => {
    const prod = (item as any).producto as any | undefined;
    const price = prod?.precio ?? prod?.price ?? (item as any).precio ?? (item as any).price ?? 0;
    return sum + price * item.cantidad;
  }, 0);

  const envioFee = envio === "express" ? 5990 : 0;
  const total = subtotal + envioFee;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idUsuario) {
      alert("Debes iniciar sesión para realizar el pago");
      navigate("/login");
      return;
    }

    // Validaciones
    const nuevosErrores: { [key: string]: string } = {};
    if (!validarNombre(nombre)) nuevosErrores["nombre"] = "Nombre inválido.";
    if (!validarCorreo(email)) nuevosErrores["email"] = "Correo inválido.";
    if (!validarTelefono(telefono)) nuevosErrores["telefono"] = "Teléfono inválido.";
    if (!validarDireccion(direccion)) nuevosErrores["direccion"] = "Dirección inválida.";
    if (!validarNoVacio(ciudad)) nuevosErrores["ciudad"] = "Ciudad requerida.";
    if (!validarNoVacio(codigoPostal)) nuevosErrores["codigoPostal"] = "Código postal requerido.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      // 1) Generar boleta REAL en tu microservicio 8083
      const res = await BoletaAPI.generar(idUsuario);
      const boleta = res.data;

      // 2) Vaciar carrito REAL (backend)
      vaciarCarrito();

      // Guardar mensaje y mostrar modal/mensaje
      setSuccessMsg(boleta.mensaje || "¡Compra exitosa!");
      setBoletaId(boleta.id);
      setShowSuccess(true);

    } catch (err: any) {
      console.error("Error generando boleta:", err);
      if (err?.response?.data?.mensaje) {
        alert(err.response.data.mensaje);
      } else if (err?.message) {
        alert("Error: " + err.message);
      } else {
        alert("Hubo un error al procesar la compra.");
      }
    }
  };


  if (showSuccess) {
    return (
      <div className="container mt-4">
        {/* Modal Bootstrap */}
        <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{successMsg}</h5>
              </div>
              <div className="modal-body">
                <p>¿Quieres seguir viendo nuestros productos?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => navigate("/productos")}>Ver productos</button>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Ir al inicio</button>
                {boletaId && (
                  <button className="btn btn-success" onClick={() => navigate(`/boleta/${boletaId}`)}>Ver boleta</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Checkout</h2>
        <p>No hay productos en el carrito.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {showSuccess ? (
        <>
          {/* Modal Bootstrap */}
          <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{successMsg}</h5>
                </div>
                <div className="modal-body">
                  <p>¿Quieres seguir viendo nuestros productos?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => navigate("/productos")}>Ver productos</button>
                  <button className="btn btn-secondary" onClick={() => navigate("/")}>Ir al inicio</button>
                  {boletaId && (
                    <button className="btn btn-success" onClick={() => navigate(`/boleta/${boletaId}`)}>Ver boleta</button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Mensaje en pantalla */}
          <div className="alert alert-success mt-4" role="alert">
            {successMsg} ¿Quieres seguir viendo nuestros productos?
            <div className="mt-3">
              <button className="btn btn-primary me-2" onClick={() => navigate("/productos")}>Ver productos</button>
              <button className="btn btn-secondary me-2" onClick={() => navigate("/")}>Ir al inicio</button>
              {boletaId && (
                <button className="btn btn-success" onClick={() => navigate(`/boleta/${boletaId}`)}>Ver boleta</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  className={`form-control${errores["nombre"] ? " is-invalid" : ""}`}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                {errores["nombre"] && <div className="invalid-feedback">{errores["nombre"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control${errores["email"] ? " is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errores["email"] && <div className="invalid-feedback">{errores["email"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  className={`form-control${errores["telefono"] ? " is-invalid" : ""}`}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
                {errores["telefono"] && <div className="invalid-feedback">{errores["telefono"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input
                  className={`form-control${errores["direccion"] ? " is-invalid" : ""}`}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
                {errores["direccion"] && <div className="invalid-feedback">{errores["direccion"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Ciudad</label>
                <input
                  className={`form-control${errores["ciudad"] ? " is-invalid" : ""}`}
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                />
                {errores["ciudad"] && <div className="invalid-feedback">{errores["ciudad"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Código postal</label>
                <input
                  className={`form-control${errores["codigoPostal"] ? " is-invalid" : ""}`}
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  required
                />
                {errores["codigoPostal"] && <div className="invalid-feedback">{errores["codigoPostal"]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Opciones de envío</label>
                <select
                  className="form-select"
                  value={envio}
                  onChange={(e) => setEnvio(e.target.value as any)}
                >
                  <option value="standard">Estándar (gratis)</option>
                  <option value="express">Express (+ $5.990)</option>
                </select>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary">Pagar ${total}</button>
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <h4>Resumen de la orden</h4>
            <ul className="list-group mb-3">
              {carrito.map((item, idx) => {
                const prod = (item as any).producto as any | undefined;
                const price = prod?.precio ?? prod?.price ?? (item as any).precio ?? (item as any).price ?? 0;
                const name = prod?.nombre ?? prod?.name ?? `Producto ${(prod?.id ?? (item as any).idProducto) ?? idx}`;
                const keyId = item.id ?? prod?.id ?? (item as any).idProducto ?? idx;
                return (
                  <li
                    key={keyId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{name}</strong>
                      <div className="text-muted small">
                        {item.cantidad} x ${price}
                      </div>
                    </div>
                    <div>${price * item.cantidad}</div>
                  </li>
                );
              })}
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Envío</span>
                <strong>${envioFee}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>${total}</strong>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
