import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";


const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const API_BASE = (typeof API_BASE_RAW === 'string' ? API_BASE_RAW.trim() : '');
function url(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE) return p; // relative same-origin when not set
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${p}`;
}
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

  const ignoreUser = async (id: number) => {
    if (!confirm('¿Ignorar esta solicitud? El usuario no será aprobado y su cuenta será eliminada.')) return;
    const res = await fetch(url(`/api/admin/users/${id}`), { method: 'DELETE', headers: { ...authHeaders() }, credentials: 'include' });
    if (res.ok || res.status === 204) load(); else alert('No se pudo ignorar');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <div className="reserva-wrap">
          <h2>Aprobaciones Pendientes (Profesionales)</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((u) => (
              <div key={u.id} className="card" style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', width: 560, margin: '0 auto', cursor: 'default' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>{u.username}</div>
                  <div style={{ color: '#666' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <button className="button" onClick={() => approve(u.id)} style={{ padding: '8px 16px', borderRadius: 12, width: 110 }}>Aprobar</button>
                  <button className="button" onClick={() => ignoreUser(u.id)} style={{ padding: '8px 16px', borderRadius: 12, background: '#b00020', width: 110 }}>Ignorar</button>
                </div>
              </div>
            ))}
            {!loading && items.length === 0 && <div>No hay profesionales pendientes.</div>}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminPendingProfessionals;
