import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Registro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ok = await register(formData.email, formData.password, formData.nombre);

    if (ok) {
      navigate("/login");
    } else {
      setError("No se pudo crear la cuenta");
    }
  };

  return (
    <main className="container my-5">
      <h2 className="text-center mb-4">Registro</h2>
      <form
        className="mx-auto"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <button type="submit" className="btn btn-success w-100">
          Registrar
        </button>
      </form>
    </main>
  );
};

export default Registro;
