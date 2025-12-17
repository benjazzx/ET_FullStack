import { describe, it, expect, vi } from 'vitest';
import { ProductosAPI } from '../../API/productos';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockAxios = axios;

describe('ProductosAPI', () => {
  it('llama a getAll correctamente', async () => {
    await ProductosAPI.getAll();
    expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/products'));
  });

  it('llama a getById correctamente', async () => {
    await ProductosAPI.getById(5);
    expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/products/5'));
  });

  it('llama a create correctamente', async () => {
    const data = { nombre: 'Nuevo', precio: 100 };
    await ProductosAPI.create(data);
    expect(mockAxios.post).toHaveBeenCalledWith(expect.stringContaining('/products'), data);
  });

  it('llama a update correctamente', async () => {
    const data = { nombre: 'Editado', precio: 200 };
    await ProductosAPI.update(2, data);
    expect(mockAxios.put).toHaveBeenCalledWith(expect.stringContaining('/products/2'), data);
  });

  it('llama a delete correctamente', async () => {
    await ProductosAPI.delete(3);
    expect(mockAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/products/3'));
  });
});
