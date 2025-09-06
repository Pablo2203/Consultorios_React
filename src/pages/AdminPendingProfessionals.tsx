import React, { useEffect, useState } from "react";
import Header from "../Header";
import { Link } from "react-router-dom";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";
function url(path: string) { return new URL(path.replace(/^\//, ""), API_BASE || "/").toString(); }
function authHeaders(): HeadersInit {
  const token = (typeof localStorage !== 'undefined' && localStorage.getItem('ADMIN_TOKEN')) || '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type PendingUser = { id: number; username: string; email: string; enabled: boolean; role: string };

const AdminPendingProfessionals: React.FC = () => {
  const [items, setItems] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(url('/api/admin/users/professionals/pending'), { headers: { ...authHeaders() }, credentials: 'include' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setItems(await res.json());
    } catch (e: any) { setError(e?.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    const res = await fetch(url(`/api/admin/users/${id}/approve`), { method: 'PATCH', headers: { ...authHeaders() }, credentials: 'include' });
    if (res.ok) load(); else alert('No se pudo aprobar');
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap">
          <h2>Pendientes de aprobación (Profesionales)</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((u) => (
              <div key={u.id} className="card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.username}</div>
                  <div style={{ color: '#666' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="button" onClick={() => approve(u.id)}>Aprobar</button>
                  <Link className="button" to={`/admin/professionals/${u.id}/profile`}>Editar Perfil</Link>
                </div>
              </div>
            ))}
            {!loading && items.length === 0 && <div>No hay profesionales pendientes.</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPendingProfessionals;
