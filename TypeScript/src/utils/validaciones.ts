// src/utils/validaciones.ts

export function validarNombre(nombre: string): boolean {
  return (
    nombre.length >= 8 &&
    /[A-Z]/.test(nombre) &&
    /[^A-Za-z0-9]/.test(nombre) &&
    !/\s/.test(nombre)
  );
}

export function validarCorreo(email: string): boolean {
  return !/\s/.test(email);
}

// Valida que la contraseña sea segura: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
export function validarContrasena(contrasena: string): boolean {
  return (
    contrasena.length >= 8 &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /[0-9]/.test(contrasena) &&
    /[^A-Za-z0-9]/.test(contrasena)
  );
}

// Valida un número de teléfono (ejemplo: 9 dígitos, solo números, sin espacios)
export function validarTelefono(telefono: string): boolean {
  return /^\d{9,15}$/.test(telefono);
}

// Valida que la dirección no esté vacía y no tenga caracteres inválidos
export function validarDireccion(direccion: string): boolean {
  return direccion.trim().length > 0 && /^[A-Za-z0-9\s#.,-]+$/.test(direccion);
}

// Valida que un campo no esté vacío
export function validarNoVacio(valor: string): boolean {
  return valor.trim().length > 0;
}
