import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Perfil = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setNombre(user?.nombre || user?.email?.split('@')[0] || '');
  }, [isAuthenticated, navigate, user]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN" || user.role === "admin";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile({ nombre, password: password || undefined });
      setMessage('Perfil actualizado');
      setPassword('');
    } catch (err) {
      setMessage('Error al actualizar');
    }
  };

  return (
    <div className="container my-5">
      <h2>Perfil de usuario</h2>
      <div className="card p-3" style={{ maxWidth: 600 }}>
        <div className="mb-3"><strong>Email:</strong> {user.email}</div>
        <div className="mb-3"><strong>Nombre de usuario:</strong> {user.nombre || '—'}</div>
        <div className="mb-3"><strong>Rol:</strong> {isAdmin ? 'Administrador' : 'Usuario'}</div>
        <pre style={{background:'#eee',padding:'8px',marginTop:'8px'}}>{JSON.stringify(user, null, 2)}</pre>

        {!isAdmin ? (
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña (dejar en blanco para no cambiar)</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">Guardar</button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>Cancelar</button>
            </div>
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </form>
        ) : (
          <div className="alert alert-secondary">La cuenta de administrador no puede editarse aquí.</div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
