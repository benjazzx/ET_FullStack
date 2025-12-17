import { useState } from "react";

interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

const Contacto = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setEnviado(true);

    setTimeout(() => {
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
      setEnviado(false);
    }, 3000);
  };

  return (
    <>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="text-center fw-bold">Ponte en Contacto</h1>
            <p className="text-center text-muted mb-5">
              ¿Tienes alguna duda? Rellena el formulario y te responderemos.
            </p>

            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="asunto" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="asunto"
                  required
                  value={formData.asunto}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label">
                  Mensaje
                </label>
                <textarea
                  className="form-control"
                  id="mensaje"
                  rows={5}
                  required
                  value={formData.mensaje}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={enviado}
              >
                {enviado ? "Enviado " : "Enviar Mensaje"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2025 ForoTech - Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Contacto;
