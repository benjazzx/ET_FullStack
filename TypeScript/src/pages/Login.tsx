import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Credenciales {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<Credenciales>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(""); // limpiar error previo

    const ok = await login(formData.email, formData.password);

    if (!ok) {
      setError("Credenciales incorrectas");
      return;
    }

    navigate("/");
  };

  return (
    <>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Iniciar Sesión</h3>

                <form id="loginForm" onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger text-center py-2">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100">
                    Ingresar
                  </button>

                  <div className="text-center mt-3">
                    <Link to="/registro">¿No tienes cuenta? Regístrate aquí</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2025 ForoTech - Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Login;
