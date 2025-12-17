import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { ProductosAPI } from "../API/productos";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria?: string;
}

const Productos = () => {
  const [items, setItems] = useState<Producto[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    ProductosAPI.getAll()
      .then((res) => {
        console.log("PRODUCTOS RECIBIDOS:", res.data);

        // ADAPTACIÓN DEL BACKEND → FRONTEND
        const adaptados: Producto[] = res.data
          // Eliminar productos corruptos
          .filter((p: any) => p.name !== null)
          // Adaptar campos al formato del front
          .map((p: any) => ({
            id: p.id,
            nombre: p.name ?? "Sin nombre",
            descripcion: p.description ?? "Sin descripción",
            precio: p.price ?? 0,
            imagen: p.imageUrl ?? "/placeholder.png",
            categoria: "General"
          }));

        setItems(adaptados);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
      });
  }, []);

  const filtered = items.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Productos</h2>

      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="row" id="productos-container">
        {filtered.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}

        {filtered.length === 0 && (
          <div className="col-12 text-center">
            No se encontraron productos.
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
