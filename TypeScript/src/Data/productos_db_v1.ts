import type { Producto } from "../types/product";
import { productosIniciales } from "./productosIniciales";

const STORAGE_KEY = "productos_db_v1";

// --- CARGAR DATOS ---
let productos: Producto[] = [];

function cargar() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    productos = JSON.parse(saved);
  } else {
    productos = productosIniciales;
    guardar();
  }
}

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}

// Ejecutar carga al iniciar
cargar();

// --- MÉTODOS CRUD ---
export function getAll(): Producto[] {
  return productos;
}

export function getById(id: number): Producto | null {
  return productos.find((p) => p.id === id) || null;
}

export function create(p: Partial<Producto>): Producto {
  const nuevo: Producto = {
    id: Date.now(),
    nombre: p.nombre || "",
    precio: p.precio || 0,
    imagen: p.imagen || "",
    descripcion: p.descripcion || "",
    categoria: p.categoria || "Otros",
  };

  productos.push(nuevo);
  guardar();
  notificar();
  return nuevo;
}

export function update(id: number, datos: Partial<Producto>) {
  productos = productos.map((p) =>
    p.id === id ? { ...p, ...datos } : p
  );
  guardar();
  notificar();
}

export function remove(id: number) {
  productos = productos.filter((p) => p.id !== id);
  guardar();
  notificar();
}

// --- SUSCRIPCIÓN PARA QUE REACT SE ACTUALICE ---
let listeners: ((data: Producto[]) => void)[] = [];

export function subscribe(cb: (data: Producto[]) => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notificar() {
  listeners.forEach((cb) => cb(getAll()));
}
