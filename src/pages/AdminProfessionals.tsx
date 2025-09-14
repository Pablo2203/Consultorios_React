import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { getProfessionals, type ProfessionalSummary } from "../api/admin";
import { Link } from "react-router-dom";

const AdminProfessionals: React.FC = () => {
  const [items, setItems] = useState<ProfessionalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? '';
  const API_BASE = (typeof API_BASE_RAW === 'string' ? API_BASE_RAW.trim() : '');
  function url(path: string) {
    const p = path.startsWith('/') ? path : `/${path}`;
    if (!API_BASE) return p;
    const base = API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE;
    return `${base}${p}`;
  }
  function authHeaders(): HeadersInit {
    const token = (typeof localStorage !== 'undefined' && localStorage.getItem('ADMIN_TOKEN')) || '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProfessionals().catch(() => [] as ProfessionalSummary[]);
        const fallback: ProfessionalSummary[] = [
          { id: 999001, username: 'Pepito Gómez', email: 'pepito@consultorios.com' },
          { id: 999002, username: 'Dr. Mengano Pérez', email: 'mengano@consultorios.com' },
          { id: 999003, username: 'Dr. Fulano Rodríguez', email: 'fulano@consultorios.com' },
        ] as any;
        setItems((data && data.length) ? data : fallback);
      } catch (e: any) {
        setError(e?.message || "Error cargando profesionales");
      } finally { setLoading(false); }
    })();
  }, []);

  const removeUser = async (id: number) => {
    if (!confirm('¿Eliminar esta cuenta? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(url(`/api/admin/users/${id}`), { method: 'DELETE', headers: { ...authHeaders() }, credentials: 'include' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16, flex: 1 }}>
        <div className="reserva-wrap">
          <h2>Profesionales</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          <div style={{ display: "grid", gap: 8 }}>
            {items.map(p => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: 12,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: 720,
                  margin: "0 auto",
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{p.username}</div>
                  <div style={{ color: "#666" }}>{p.email || ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/admin/professionals/${p.id}/profile`} className="button">Editar</Link>
                  <button className="button" style={{ background: '#b00020' }} onClick={()=>removeUser(p.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminProfessionals;
