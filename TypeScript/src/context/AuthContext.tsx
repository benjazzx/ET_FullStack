import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react";

import { UsuariosAPI, apiUsuarios } from "../API/usuarios";
import { apiCarrito } from "../API/carrito";
import { apiBoleta } from "../API/boleta";
import axios from "axios";

interface User {
  id: number;
  nombre: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, nombre: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateProfile: (data: { nombre?: string; password?: string }) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Permite actualizar nombre localmente (y simular cambio de password)
  const updateProfile = (data: { nombre?: string; password?: string }) => {
    setUser((prev) => prev ? { ...prev, nombre: data.nombre ?? prev.nombre } : prev);
    if (user) {
      const updated = { ...user, nombre: data.nombre ?? user.nombre };
      localStorage.setItem("userData", JSON.stringify(updated));
    }
    // Aquí podrías agregar lógica para actualizar en backend si lo deseas
  };

  // Cargar sesión del localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    const savedToken = localStorage.getItem("token");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) {
      setToken(savedToken);
      // Adjuntar token a las peticiones axios por defecto (usuarios, carrito, productos que usan axios global)
      apiUsuarios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      try {
        apiCarrito.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          try {
            apiBoleta.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          } catch (e) {}
      } catch (e) {
        // no crítico si apiCarrito no existe
      }
      // también propagar al axios global por si otros APIs usan axios directamente
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // LOGIN REAL
  const login = async (email: string, password: string) => {
    try {
      const res = await UsuariosAPI.login(email, password);
      const data: any = res.data;

      // Si la API responde con un objeto error/mensaje
      if (data && (data.message === "Credenciales incorrectas" || data.error === "Credenciales incorrectas")) {
        return false;
      }

      // Normalizar distintos formatos de respuesta de token
      let tokenStr: string | null = null;
      let role: string | undefined = undefined;
      if (typeof data === "string") tokenStr = data;
      else if (data && (data.token || data.accessToken)) {
        tokenStr = data.token ?? data.accessToken;
        role = data.role;
      }
      if (!tokenStr) {
        return false;
      }

      // Guardar token
      setToken(tokenStr);
      localStorage.setItem("token", tokenStr);
      apiUsuarios.defaults.headers.common["Authorization"] = `Bearer ${tokenStr}`;
      try {
        apiCarrito.defaults.headers.common["Authorization"] = `Bearer ${tokenStr}`;
        try {
          apiBoleta.defaults.headers.common["Authorization"] = `Bearer ${tokenStr}`;
        } catch (e) {}
      } catch (e) {}
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenStr}`;

      // Extraer info del JWT
      let payload: any = null;
      try {
        const parts = tokenStr.split(".");
        if (parts.length >= 2) {
          payload = JSON.parse(atob(parts[1]));
        }
      } catch (e) {}

      const emailFromToken = payload?.sub ?? payload?.email;
      const roleFromToken = payload?.roleName || payload?.role || role;

      // Obtener usuario por email desde /users
      const usersRes = await UsuariosAPI.getAll();
      const usuarios = usersRes.data;

      let usuario = usuarios.find((u: any) => u.email === email) ||
                    usuarios.find((u: any) => u.email === emailFromToken);

      // Si no existe en la lista, crear un usuario mínimo desde el payload
      if (!usuario && payload && emailFromToken) {
        usuario = {
          id: payload.userId ?? payload.id ?? -1,
          nombre: payload.nombre ?? payload.fullName ?? emailFromToken,
          email: emailFromToken,
          role: roleFromToken || payload?.roleName,
        } as any;
      } else if (usuario) {
        // Fusionar datos del backend con el rol del token o roleName
        usuario = { ...usuario, role: roleFromToken || usuario.roleName };
      }

      if (!usuario) return false;

      setUser(usuario);
      localStorage.setItem("userData", JSON.stringify(usuario));
      localStorage.setItem("userId", String(usuario.id));

      console.debug("Auth login -> usuario guardado", usuario);
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Remover header de autorización
    try {
      delete apiUsuarios.defaults.headers.common["Authorization"];
      try {
        delete apiCarrito.defaults.headers.common["Authorization"];
      } catch (e) {
        // ignore
      }
      try {
        delete apiBoleta.defaults.headers.common["Authorization"];
      } catch (e) {
        // ignore
      }
      try {
        delete axios.defaults.headers.common["Authorization"];
      } catch (e) {
        // ignore
      }
    } catch (e) {
    }
  };

  // REGISTER REAL
  const register = async (email: string, password: string, nombre: string) => {
    try {
      const res = await UsuariosAPI.register({
        email,
        password,
        nombre,
      });

      if (!res.data) return false;

      return true;
    } catch (err) {
      console.error("Error en registro:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        isAdmin: user?.role === "ADMIN" || user?.role === "admin" || false,
        isAuthenticated: !!user,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
