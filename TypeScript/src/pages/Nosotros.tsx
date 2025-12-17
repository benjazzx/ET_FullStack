import equipo from "../assets/img/images.jpeg";

const Nosotros = () => {
  return (
    <>
      {/* Navbar is rendered globally from the Navbar component */}

      {/* Contenido principal */}
      <main className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="fw-bold">Nuestra Historia</h1>
            <p className="lead">
              Somos <strong>ForoTech</strong>, un equipo apasionado por la
              tecnología y comprometido con ofrecer los mejores componentes a
              precios justos. Desde nuestros inicios, hemos trabajado para
              construir una comunidad de entusiastas del PC, brindando no solo
              productos, sino también asesoría y confianza.
            </p>
            <p>
              Nuestra misión es simple: hacer que la tecnología de punta sea
              accesible para todos, desde el gamer que recién comienza hasta el
              profesional que busca la máxima potencia.
            </p>
          </div>

          <div className="col-md-6">
            <img
              src={equipo}
              alt="Nuestro equipo"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          © 2025 ForoTech - Todos los derechos reservados
        </p>
      </footer>
    </>
  );
};

export default Nosotros;
