export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria?: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
}

export interface Post {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
  fecha: string;
  precioRelacionado?: number;
}

export interface ItemCarrito {
  id?: number;
  producto: Producto;
  cantidad: number;
  precio?: number;
}
