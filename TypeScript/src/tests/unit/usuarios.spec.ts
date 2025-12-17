import { describe, it, expect, vi } from 'vitest';
import { UsuariosAPI } from '../../API/usuarios';

vi.mock('axios', () => {
  const instance = {
    post: vi.fn(),
    get: vi.fn(),
  };
  return {
    default: Object.assign(() => instance, instance, { create: () => instance }),
    create: () => instance,
  };
});
import axios from 'axios';
const mockApiUsuarios = axios.create();

describe('UsuariosAPI', () => {
  it('llama a login correctamente', async () => {
    await UsuariosAPI.login('test@mail.com', '1234');
    expect(mockApiUsuarios.post).toHaveBeenCalledWith('/auth/login', { email: 'test@mail.com', password: '1234' });
  });

  it('llama a register correctamente', async () => {
    const user = { nombre: 'Juan', correo: 'juan@mail.com', password: '123' };
    await UsuariosAPI.register(user);
    expect(mockApiUsuarios.post).toHaveBeenCalledWith('/auth/register', user);
  });

  it('llama a getAll correctamente', async () => {
    await UsuariosAPI.getAll();
    expect(mockApiUsuarios.get).toHaveBeenCalledWith('/users');
  });

  it('llama a getById correctamente', async () => {
    await UsuariosAPI.getById(7);
    expect(mockApiUsuarios.get).toHaveBeenCalledWith('/users/7');
  });
});

describe('Usuarios', () => {
  it('test de ejemplo', () => {
    expect(true).toBe(true);
  });
});
