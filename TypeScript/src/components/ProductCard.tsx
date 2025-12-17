
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import type { Producto } from "../types/product";

// Importa aquí todas las imágenes que quieras usar por nombre
import img1 from '../assets/img/images (1).jpeg';
import img2 from '../assets/img/images (2).jpeg';
import img3 from '../assets/img/images (3).jpeg';
// ...agrega más si es necesario

const imagenes: Record<string, string> = {
  'images (1).jpeg': img1,
  'images (2).jpeg': img2,
  'images (3).jpeg': img3,
};


interface Props {
  producto: Producto;
}

const ProductCard = ({ producto }: Props) => {
  const { agregarAlCarrito } = useCarrito();

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={imagenes[producto.imagen] || producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: 200, objectFit: "cover" }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = "/assets/img/placeholder.png";
          }}
        />
        <div className="card-body text-center">
          <h5>{producto.nombre}</h5>
          <p>${producto.precio}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Link
              to={`/detalle/${producto.id}`}
              state={{ producto }}
              className="btn btn-outline-primary"
            >
              Ver Detalle
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

