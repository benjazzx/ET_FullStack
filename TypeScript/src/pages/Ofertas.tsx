import { useEffect, useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { ProductosAPI } from "../API/productos";
import type { Producto } from "../types/product";

interface ProductoConOferta extends Producto {
  discount: number;
  discountedPrice: number;
}

const Ofertas = () => {
  const [productos, setProductos] = useState<ProductoConOferta[]>([]);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    ProductosAPI.getAll()
      .then((res) => {
        // Mapear campos del backend a los del frontend
        const all: Producto[] = res.data.map((p: any) => ({
          id: p.id,
          nombre: p.name,
          descripcion: p.description,
          precio: p.price,
          imagen: p.imageUrl,
          categoria: p.categoria || undefined,
        }));

        // Descuentos por ID (puedes editar)
        const discounts: Record<number, number> = {
          1: 0.15,
          2: 0.1,
          3: 0.2,
        };

        // Aplicar ofertas
        const withOffers = all
          .map((p) => {
            const discount = discounts[p.id] ?? 0;
            const discountedPrice = Math.round(p.precio * (1 - discount));
            return { ...p, discount, discountedPrice };
          })
          .filter((p) => p.discount > 0);

        setProductos(withOffers);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Ofertas</h2>
      <div className="row">
        {productos.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100 text-center">
              <img
                src={p.imagen}
                className="card-img-top"
                alt={p.nombre}
                style={{ height: 200, objectFit: "cover" }}
              />
              <div className="card-body">

                <h5 className="card-title">{p.nombre}</h5>
                <p className="mb-1">
                  <del className="text-muted">${new Intl.NumberFormat("es-CL").format(p.precio)}</del>
                </p>
                <p className="fw-bold text-danger">
                  ${new Intl.NumberFormat("es-CL").format(p.discountedPrice)} ({Math.round(p.discount * 100)}% OFF)
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    agregarAlCarrito({
                      ...p,
                      precio: p.discountedPrice, // aplicar precio rebajado
                    })
                  }
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}

        {productos.length === 0 && (
          <div className="col-12 text-center mt-4">
            <p>No hay ofertas disponibles por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ofertas;
