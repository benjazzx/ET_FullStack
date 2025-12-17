import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import type { Producto, ItemCarrito } from "../types/product";
import { CarritoAPI } from "../API/carrito";
import { ProductosAPI } from "../API/productos";

interface CarritoContextType {
  carrito: ItemCarrito[];
  cargarCarrito: () => void;
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (idItem: number) => void;
  vaciarCarrito: () => void;
  total: number;
  obtenerTotal: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return context;
};

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);
  const { user } = useAuth();

  // Obtener id de usuario desde el contexto de auth o fallback a localStorage
  const stored = localStorage.getItem("userId");
  const storedNum = stored ? Number(stored) : 0;
  const idUsuario = user?.id ?? (isNaN(storedNum) ? 0 : storedNum);

  // Mantener sincronizado localStorage.userId cuando el contexto auth cambia
  useEffect(() => {
    try {
      if (user?.id) {
        localStorage.setItem("userId", String(user.id));
        // eslint-disable-next-line no-console
        console.debug("CarritoProvider -> synced localStorage.userId", user.id);
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  // 🔵 1. Cargar carrito desde el backend
  const cargarCarrito = async () => {
    // Si no hay usuario loggeado, usar carrito de invitado en localStorage
    if (!idUsuario) {
      try {
        const raw = localStorage.getItem("guestCart");
        const items = raw ? (JSON.parse(raw) as ItemCarrito[]) : [];
        setCarrito(items);
      } catch (err) {
        console.error("Error leyendo guestCart desde localStorage:", err);
        setCarrito([]);
      }
      return;
    }

    try {
      const res = await CarritoAPI.obtenerCarrito(idUsuario);
      const data = res.data || [];
      // `res.data` puede ser directamente un arreglo o un objeto { items: [...] }
      const rawItems: any[] = Array.isArray(data) ? data : Array.isArray((data as any).items) ? (data as any).items : [];
      const items: ItemCarrito[] = rawItems.map((it: any) => {
        const id = it.id ?? it.itemId ?? undefined;
        const cantidad = it.cantidad ?? it.qty ?? it.cantidadItem ?? 1;
        const producto = it.producto ?? it.product ?? (it.idProducto ? undefined : undefined);
        const idProducto = it.idProducto ?? it.productoId ?? it.productId ?? undefined;
        const precio = it.precio ?? it.price ?? it.precioItem ?? undefined;
        // devolver estructura parcial para completar luego
        return ({ id, cantidad, producto, idProducto, precio } as unknown) as ItemCarrito;
      });

      // Buscar items que no tengan `producto` pero sí `idProducto` y resolverlos
      const idsToFetch = Array.from(new Set(items.filter((it: any) => !it.producto && (it as any).idProducto).map((it: any) => Number((it as any).idProducto))));
      if (idsToFetch.length > 0) {
        const proms = idsToFetch.map((pid) => ProductosAPI.getById(pid).then((r) => r.data).catch(() => null));
        const prods = await Promise.all(proms);
        const prodMap: Record<number, any> = {};
        prods.forEach((p) => {
          if (p && p.id != null) prodMap[Number(p.id)] = p;
        });

        const completed = items.map((it: any) => {
          if (!it.producto && it.idProducto && prodMap[Number(it.idProducto)]) {
            const prod = prodMap[Number(it.idProducto)];
            it.producto = prod;
            if (it.precio == null) it.precio = prod?.precio ?? (prod as any)?.price ?? undefined;
          }
          return it as ItemCarrito;
        });

        setCarrito(completed as ItemCarrito[]);
          // actualizar total tras cargar items
          obtenerTotal();
          return;
      }

      setCarrito(items as ItemCarrito[]);
      obtenerTotal();
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setCarrito([]);
    }
  };

  const obtenerTotal = () => {
    if (!idUsuario) {
      setTotal(0);
      return;
    }

    CarritoAPI.obtenerTotal(idUsuario)
      .then((res) => {
        const val = res?.data;
        // res.data puede venir como número o string (BigDecimal)
        const num = typeof val === "number" ? val : parseFloat(String(val)) || 0;
        setTotal(num);
      })
      .catch((err) => {
        console.error("Error obteniendo total del carrito:", err);
        setTotal(0);
      });
  };

  // 🔵 2. Se carga el carrito REAL al iniciar
  useEffect(() => {
    // DEBUG: mostrar idUsuario cuando cambia
    // eslint-disable-next-line no-console
    console.debug("CarritoProvider -> idUsuario changed", idUsuario);
    cargarCarrito();
  }, [idUsuario]);

  // 🔵 3. Agregar producto usando la API REAL
  const agregarAlCarrito = (producto: Producto) => {
    // DEBUG: mostrar contexto de usuario al intentar agregar
    // eslint-disable-next-line no-console
    console.debug("agregarAlCarrito called", { idUsuario, user, stored });

    if (!idUsuario) {
      // Manejar carrito de invitado en localStorage
      try {
        const raw = localStorage.getItem("guestCart");
        const items: ItemCarrito[] = raw ? JSON.parse(raw) : [];
        // Buscar si ya existe el producto
        const existente = items.find((it) => it.producto.id === producto.id);
        if (existente) {
          existente.cantidad = (existente.cantidad ?? 1) + 1;
        } else {
          items.push({ id: Date.now(), producto, cantidad: 1 });
        }
        localStorage.setItem("guestCart", JSON.stringify(items));
        setCarrito(items);
        return;
      } catch (err) {
        console.error("Error guardando guestCart:", err);
        alert("No se pudo agregar el producto al carrito de invitado.");
        return;
      }
    }

    const data = {
      idUsuario: idUsuario,
      idProducto: producto.id,
      cantidad: 1,
      precio: producto.precio,
    };

    // Log request data for debugging
    // eslint-disable-next-line no-console
    console.debug("CarritoAPI.agregarProducto -> request", data);

    CarritoAPI.agregarProducto(data)
      .then(async (res) => {
        // eslint-disable-next-line no-console
        console.debug("CarritoAPI.agregarProducto -> response", res?.data);

        const resp = res?.data;
        // Si la respuesta incluye el carrito o items, recargar para seguridad
        if (resp && (Array.isArray(resp) || resp.items || resp.items === 0)) {
          cargarCarrito();
          return;
        }

        // Si la respuesta es un objeto con idProducto (nuevo item), resolver producto y actualizar estado optimistamente
        const idProductoResp = resp?.idProducto ?? resp?.productoId ?? resp?.id_producto ?? resp?.idProduct;
        const cantidadResp = resp?.cantidad ?? resp?.qty ?? data.cantidad;

        if (idProductoResp != null) {
          try {
            const prodRes = await ProductosAPI.getById(Number(idProductoResp));
            const productoFetched = prodRes.data;

            setCarrito((prev) => {
              // buscar si ya existe el producto en el carrito
              const existing = prev.find((it) => it.producto?.id === productoFetched.id);
              if (existing) {
                // aumentar cantidad
                return prev.map((it) =>
                  it.producto?.id === productoFetched.id ? { ...it, cantidad: (it.cantidad ?? 1) + (cantidadResp ?? 1) } : it
                );
              }

              // si no existe, añadir nuevo item (id puede venir del resp)
              const newItem = { id: resp?.id ?? Date.now(), producto: productoFetched, cantidad: cantidadResp ?? 1, precio: resp?.precio ?? productoFetched.precio ?? productoFetched.price ?? data.precio } as ItemCarrito;
              return [...prev, newItem];
            });

            // refrescar en background y actualizar total
            cargarCarrito();
            obtenerTotal();
            return;
          } catch (e) {
            console.error("Error resolviendo producto despues de agregar:", e);
            // fallback: recargar carrito completo
            cargarCarrito();
            return;
          }
        }

        // Si nada de lo anterior aplica, recargar el carrito por seguridad
        cargarCarrito();
      })
      .catch((err: any) => {
        console.error("Error agregando producto:", err?.response ?? err);
        // mostrar cuerpo de respuesta si existe
        if (err?.response?.data) console.error("Response data:", err.response.data);
      });
  };

  // 🔵 4. Eliminar item del carrito desde backend
  const eliminarDelCarrito = (idItem: number) => {
    if (!idUsuario) {
      try {
        const raw = localStorage.getItem("guestCart");
        const items: ItemCarrito[] = raw ? JSON.parse(raw) : [];
        const filtered = items.filter((it) => it.id !== idItem);
        localStorage.setItem("guestCart", JSON.stringify(filtered));
        setCarrito(filtered);
        return;
      } catch (err) {
        console.error("Error actualizando guestCart:", err);
        return;
      }
    }

    CarritoAPI.eliminarItem(idItem)
      .then(() => cargarCarrito())
      .catch((err) => {
        console.error("Error eliminando item:", err);
      });
  };

  // 🔵 5. Vaciar carrito completo desde backend
  const vaciarCarrito = () => {
    if (!idUsuario) {
      try {
        localStorage.removeItem("guestCart");
        setCarrito([]);
        return;
      } catch (err) {
        console.error("Error vaciando guestCart:", err);
        return;
      }
    }

    CarritoAPI.vaciarCarrito(idUsuario)
      .then(() => setCarrito([]))
      .catch((err) => {
        console.error("Error vaciando carrito:", err);
      });
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        cargarCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        total,
        obtenerTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
