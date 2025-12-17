import { Link } from "react-router-dom";
import logo from "../assets/img/ChatGPT Image 4 nov 2025, 23_03_08.png";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { carrito } = useCarrito();
  const { user, logout, isAdmin } = useAuth();
  
  return (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div className="container">
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <img src={logo} alt="Logo" height={40} />
        <span className="fw-bold ms-2">ForoTech</span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link to="/" className="nav-link">Inicio</Link></li>
          <li className="nav-item"><Link to="/productos" className="nav-link">Productos</Link></li>
          <li className="nav-item"><Link to="/ofertas" className="nav-link">Ofertas</Link></li>
          <li className="nav-item"><Link to="/nosotros" className="nav-link">Nosotros</Link></li>
          <li className="nav-item"><Link to="/blog" className="nav-link">Blog</Link></li>
          <li className="nav-item"><Link to="/contacto" className="nav-link">Contacto</Link></li>
          {!user ? (
            <>
              <li className="nav-item"><Link to="/login" className="nav-link">Iniciar Sesión</Link></li>
              <li className="nav-item"><Link to="/registro" className="nav-link">Registrarse</Link></li>
            </>
          ) : (
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user.nombre ? user.nombre : user.email}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                {isAdmin && (
                  <li><Link className="dropdown-item" to="/admin">Panel Admin</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={() => logout()}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>
          )}
          <li className="nav-item">
            <Link to="/carrito" className="nav-link d-flex align-items-center">
              <i className="bi bi-cart me-1"></i>
              Carrito
              {carrito.length > 0 && (
                <span className="badge bg-danger ms-1">{carrito.length}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
