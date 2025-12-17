// @ts-nocheck
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Carrito from '../../pages/Carrito';
import { useCarrito } from '../../context/CarritoContext';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

// 🔹 Mock del contexto
vi.mock('../../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

const mockUseCarrito = useCarrito as any;
const producto = {
  id: 1,
  nombre: 'Producto Test',
  descripcion: 'desc',
  precio: 1000,
  imagen: '',
};

describe('Carrito', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    mockUseCarrito.mockReturnValue({
      carrito: [],
      cargarCarrito: vi.fn(),
      agregarAlCarrito: vi.fn(),
      eliminarDelCarrito: vi.fn(),
      vaciarCarrito: vi.fn(),
      total: 0,
      obtenerTotal: vi.fn(),
    });

    render(<Carrito />);

    expect(
      screen.getByText(/no hay productos en el carrito/i)
    ).toBeInTheDocument();
  });

  it('muestra productos en el carrito', () => {
    mockUseCarrito.mockReturnValue({
      carrito: [
        {
          producto,
          cantidad: 2,
          id: 1,
        },
      ],
      cargarCarrito: vi.fn(),
      agregarAlCarrito: vi.fn(),
      eliminarDelCarrito: vi.fn(),
      vaciarCarrito: vi.fn(),
      total: 2000,
      obtenerTotal: vi.fn(),
    });

    render(<Carrito />);

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Total: $2000')).toBeInTheDocument();
  });

  it('elimina un producto del carrito al hacer click', async () => {
    const eliminarDelCarrito = vi.fn();
    mockUseCarrito.mockReturnValue({
      carrito: [
        { producto, cantidad: 1, id: 1 },
      ],
      cargarCarrito: vi.fn(),
      agregarAlCarrito: vi.fn(),
      eliminarDelCarrito,
      vaciarCarrito: vi.fn(),
      total: 1000,
      obtenerTotal: vi.fn(),
    });

    render(<Carrito />);
    const btn = screen.getByRole('button', { name: /eliminar/i });
    btn.click();
    expect(eliminarDelCarrito).toHaveBeenCalled();
  });

  it('vacía el carrito al hacer click en Vaciar Carrito', async () => {
    const vaciarCarrito = vi.fn();
    mockUseCarrito.mockReturnValue({
      carrito: [
        { producto, cantidad: 1, id: 1 },
      ],
      cargarCarrito: vi.fn(),
      agregarAlCarrito: vi.fn(),
      eliminarDelCarrito: vi.fn(),
      vaciarCarrito,
      total: 1000,
      obtenerTotal: vi.fn(),
    });

    render(<Carrito />);
    const btn = screen.getByRole('button', { name: /vaciar carrito/i });
    btn.click();
    expect(vaciarCarrito).toHaveBeenCalled();
  });

  it('muestra el subtotal correctamente', () => {
    mockUseCarrito.mockReturnValue({
      carrito: [
        { producto, cantidad: 3, id: 1 },
      ],
      cargarCarrito: vi.fn(),
      agregarAlCarrito: vi.fn(),
      eliminarDelCarrito: vi.fn(),
      vaciarCarrito: vi.fn(),
      total: 3000,
      obtenerTotal: vi.fn(),
    });

    render(<Carrito />);
    expect(screen.getByText('$3000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
