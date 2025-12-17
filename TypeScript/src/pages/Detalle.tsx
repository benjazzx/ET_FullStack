
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { ProductosAPI } from "../API/productos";
import type { Producto } from "../types/product";

// Importa aquí todas las imágenes que quieras usar por nombre
import img2 from '../assets/img/images (2).jpeg';
import img3 from '../assets/img/images (3).jpeg';
// ...agrega más si es necesario

const imagenes: Record<string, string> = {
  'images (2).jpeg': img2,
  'images (3).jpeg': img3,
};

const DetalleProducto = () => {
  const location = useLocation();
  const params = useParams();
  const { agregarAlCarrito } = useCarrito();

  const productoFromState = location.state?.producto as Producto | undefined;
  const id = params.id ? Number(params.id) : null;

  const [producto, setProducto] = useState<Producto | null>(productoFromState || null);
  const [loading, setLoading] = useState(!productoFromState);
  const [error, setError] = useState("");

  // Si no viene desde el estado → cargar desde backend
  useEffect(() => {
    if (!id || productoFromState) return;

    setLoading(true);

    ProductosAPI.getById(id)
      .then((res) => {
        // Mapear campos del backend a los del frontend
        const p = res.data;
        const mapped: Producto = {
          id: p.id,
          nombre: p.name,
          descripcion: p.description,
          precio: p.price,
          imagen: p.imageUrl,
          categoria: p.categoria || undefined,
        };
        setProducto(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el producto");
        setLoading(false);
      });
  }, [id, productoFromState]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h3>Cargando producto...</h3>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container mt-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary mt-3">
          Volver a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row g-5">
        <div className="col-md-6">
          {/* Mapeo estático para imágenes locales */}
          <img
            src={imagenes[producto.imagen] || producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{producto.nombre}</h2>
          <p className="lead text-primary fw-bold fs-4">
            ${producto.precio.toLocaleString("es-CL")}
          </p>

          <p>{producto.descripcion}</p>

          <button
            className="btn btn-success btn-lg mt-3"
            onClick={() => agregarAlCarrito(producto)}
          >
            Añadir al carrito
          </button>

          <Link
            to="/productos"
            className="btn btn-outline-primary btn-lg mt-3 ms-2"
          >
            Volver a Productos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
