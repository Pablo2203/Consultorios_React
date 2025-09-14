import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { getAllUsers, deleteUser, type UserSummary } from "../api/admin";
import { Link } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const [items, setItems] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setItems(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeUser = async (id: number) => {
    if (!confirm("¿Eliminar esta cuenta? Esta acción no se puede deshacer.")) return;
    try {
      await deleteUser(id);
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      alert(e?.message || "No se pudo eliminar");
    }
  };

  const filtered = items.filter((u) => (roleFilter ? u.role === roleFilter : true));

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: '72px 16px 24px', flex: 1, minHeight: '82vh' }}>
        <div className="reserva-wrap">
          <h2>Usuarios</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0 16px' }}>
            <span>Filtrar por rol:</span>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Todos</option>
              <option value="ADMIN">ADMIN</option>
              <option value="PROFESSIONAL">PROFESSIONAL</option>
              <option value="PATIENT">PATIENT</option>
            </select>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {filtered.map(u => (
              <div
                key={u.id}
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
                  flexWrap: 'nowrap'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{u.username}</div>
                  <div style={{ color: "#666" }}>{u.email || ""}</div>
                  <div style={{ color: '#333', fontSize: 12, marginTop: 4 }}>
                    Rol: <strong>{u.role}</strong> · Estado: {u.enabled ? 'Habilitado' : 'Deshabilitado'}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, whiteSpace: 'nowrap' }}>
                  {u.role === 'PROFESSIONAL' && (
                    <Link to={`/admin/professionals/${u.id}/profile`} className="button">Perfil</Link>
                  )}
                  <button className="button" style={{ background: '#b00020' }} onClick={()=>removeUser(u.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            {!loading && !filtered.length && <div>No hay usuarios para mostrar.</div>}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminUsers;
