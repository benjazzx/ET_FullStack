import type { Producto } from "../types/product";

export const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Mouse Gamer RGB",
    descripcion: "Mouse óptico con iluminación RGB",
    precio: 15990,
    imagen: "/src/assets/img/mouse.webp",
    categoria: "Periféricos",
  },
  {
    id: 2,
    nombre: "Teclado Mecánico",
    descripcion: "Blue switches, retroiluminado",
    precio: 34990,
    imagen: "/src/assets/img/teclado.webp",
    categoria: "Periféricos",
  },
  {
    id: 3,
    nombre: "Audífonos Inalámbricos",
    descripcion: "Bluetooth 5.0, cancelación de ruido",
    precio: 29990,
    imagen: "/src/assets/img/audifonos.webp",
    categoria: "Audio",
  },
];
