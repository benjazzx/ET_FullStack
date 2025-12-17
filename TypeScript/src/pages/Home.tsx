import { Link } from "react-router-dom";
import productImg from "../assets/img/descarga.jpeg";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

const Home = () => {
  const productosDestacados: Producto[] = [
    { id: 1, nombre: "NVIDIA RTX 4070", precio: 650000, imagen: productImg },
    { id: 2, nombre: "Teclado Mecánico RGB", precio: 49990, imagen: productImg },
    { id: 3, nombre: "Monitor 144Hz 27”", precio: 189990, imagen: productImg },
  ];

  return (
    <>
      {/* Navbar is rendered globally from the Navbar component */}

      {/* Header principal */}
      <header className="bg-light text-center py-5">
        <div className="container">
          <h1 className="fw-bold">Bienvenido a ForoTech</h1>
          <p className="lead">Donde la calidad se encuentra con el mejor precio</p>
          <Link to="/productos" className="btn btn-primary btn-lg mt-2">
            Explorar Productos
          </Link>
        </div>
      </header>

      {/* Sección de destacados */}
      <section className="container my-5">
        <h2 className="text-center mb-4 fw-bold">Destacados de la semana</h2>
        <div className="row justify-content-center" id="productos-container">
          {productosDestacados.map((producto) => (
            <div key={producto.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{producto.nombre}</h5>
                  <p className="text-primary fw-bold fs-5">
                    ${producto.precio.toLocaleString("es-CL")}
                  </p>
                  <Link
                    to={`/detalle/${producto.id}`}
                    state={{ producto }}
                    className="btn btn-outline-primary w-100 mt-2"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2025 ForoTech - Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Home;
