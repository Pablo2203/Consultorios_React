import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getMyAppointments } from "../api/professional";

type Appt = any;

const iso = (d: Date) => d.toISOString().slice(0,19);

const ProfessionalAgenda: React.FC = () => {
  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const from = new Date();
        const to = new Date();
        to.setDate(to.getDate() + 30);
        const data = await getMyAppointments(iso(from), iso(to));
        setItems(data || []);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap">
          <h2>Mi agenda (14 días)</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((a: any) => (
              <div key={a.id} className="card" style={{ padding: 12, display: 'grid', gap: 4 }}>
                <div><b>Especialidad:</b> {a.specialty}</div>
                <div><b>Inicio:</b> {a.startsAt}</div>
                <div><b>Fin:</b> {a.endsAt}</div>
                <div><b>Estado:</b> {a.status}</div>
                {a.firstName && <div><b>Paciente:</b> {a.firstName} {a.lastName}</div>}
              </div>
            ))}
            {!loading && items.length === 0 && <div>No hay turnos en el rango.</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalAgenda;
