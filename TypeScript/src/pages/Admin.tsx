import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProductosAPI } from "../API/productos";
import type { Producto } from "../types/product";
import type { ChangeEvent, FormEvent } from "react";

const Admin = () => {
  const [items, setItems] = useState<Producto[]>([]);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    descripcion: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();

  // CONTROL DE ACCESO
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!auth.isAdmin) {
      navigate("/no-autorizado");
      return;
    }

    // Cargar productos desde backend y mapear campos
    ProductosAPI.getAll().then(res => {
      const mapped = res.data.map((p: any) => ({
        id: p.id,
        nombre: p.name,
        descripcion: p.description,
        precio: p.price,
        imagen: p.imageUrl,
        categoria: p.categoria || undefined,
      }));
      setItems(mapped);
    });

  }, [auth, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mapear los campos del frontend a los del backend
    const payload = {
      name: form.nombre,
      price: Number(form.precio),
      imageUrl: form.imagen,
      description: form.descripcion,
    };

    if (editing) {
      await ProductosAPI.update(editing.id, payload);
    } else {
      await ProductosAPI.create(payload);
    }

    // Recargar lista
    const res = await ProductosAPI.getAll();
    const mapped = res.data.map((p: any) => ({
      id: p.id,
      nombre: p.name,
      descripcion: p.description,
      precio: p.price,
      imagen: p.imageUrl,
      categoria: p.categoria || undefined,
    }));
    setItems(mapped);

    setEditing(null);
    setForm({ nombre: "", precio: "", imagen: "", descripcion: "" });
  };

  const startEdit = (p: Producto) => {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      precio: String(p.precio),
      imagen: p.imagen || "",
      descripcion: p.descripcion || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar producto?")) return;
    await ProductosAPI.delete(id);

    const res = await ProductosAPI.getAll();
    const mapped = res.data.map((p: any) => ({
      id: p.id,
      nombre: p.name,
      descripcion: p.description,
      precio: p.price,
      imagen: p.imageUrl,
      categoria: p.categoria || undefined,
    }));
    setItems(mapped);
  };

  return (
    <div className="container my-5">
      <h2>Panel Admin - Productos</h2>
      <div className="mb-3">
        <strong>Email:</strong> {auth.user?.email || "—"} <br />
        <strong>Nombre de usuario:</strong> {auth.user?.nombre || "—"} <br />
        <strong>Rol:</strong> {auth.user?.role || "Usuario"}
        <pre style={{background:'#eee',padding:'8px',marginTop:'8px'}}>{JSON.stringify(auth.user, null, 2)}</pre>
      </div>

      <div className="row">
        {/* FORM */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5>{editing ? "Editar producto" : "Agregar producto"}</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label>Nombre</label>
                  <input
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label>Precio</label>
                  <input
                    name="precio"
                    type="number"
                    className="form-control"
                    value={form.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label>Imagen (URL)</label>
                  <input
                    name="imagen"
                    className="form-control"
                    value={form.imagen}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <button className="btn btn-success me-2" type="submit">
                  {editing ? "Guardar cambios" : "Crear producto"}
                </button>

                {editing && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setForm({ nombre: "", precio: "", imagen: "", descripcion: "" });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* LISTA */}
        <div className="col-md-6">
          <div className="list-group">
            {items.map((p) => (
              <div
                key={p.id}
                className="list-group-item d-flex justify-content-between"
              >

                <div className="d-flex align-items-center gap-2">
                  {p.imagen && (
                    <img src={imagenes[p.imagen] || p.imagen} alt={p.nombre} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} />
                  )}
                  <div>
                    <strong>{p.nombre}</strong>
                    <div className="text-muted">
                      ${new Intl.NumberFormat("es-CL").format(p.precio)}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => startEdit(p)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="alert alert-info">No hay productos.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
