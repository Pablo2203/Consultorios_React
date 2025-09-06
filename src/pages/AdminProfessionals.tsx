import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getProfessionals, type ProfessionalSummary } from "../api/admin";
import { Link } from "react-router-dom";

const AdminProfessionals: React.FC = () => {
  const [items, setItems] = useState<ProfessionalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProfessionals();
        setItems(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando profesionales");
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap">
          <h2>Profesionales</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          <div style={{ display: "grid", gap: 8 }}>
            {items.map(p => (
              <div key={p.id} className="card" style={{ padding: 12, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.username}</div>
                  <div style={{ color: "#666" }}>{p.email || ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/admin/professionals/${p.id}/profile`} className="button">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProfessionals;
