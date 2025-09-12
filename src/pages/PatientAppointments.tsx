import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getMyAppointmentsAsPatient, exportMyAppointmentsCsvAsPatient, cancelMyAppointment } from "../api/patient";

const iso = (d: Date) => d.toISOString().slice(0,19);

const PatientAppointments: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromIso, setFromIso] = useState<string>("");
  const [toIso, setToIso] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const from = new Date();
        const to = new Date();
        to.setDate(to.getDate() + 30);
        const f = iso(from); const t = iso(to);
        setFromIso(f); setToIso(t);
        const data = await getMyAppointmentsAsPatient(f, t);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Mis turnos (próximos 30 días)</h2>
            <button className="button" onClick={() => exportMyAppointmentsCsvAsPatient(fromIso, toIso)}>Exportar CSV</button>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((a: any) => (
              <div key={a.id} className="card" style={{ padding: 12, display: 'grid', gap: 4 }}>
                <div><b>Especialidad:</b> {a.specialty}</div>
                <div><b>Inicio:</b> {a.startsAt}</div>
                <div><b>Fin:</b> {a.endsAt}</div>
                <div><b>Estado:</b> {a.status}</div>
                {a.preferredProfessional && <div><b>Profesional:</b> {a.preferredProfessional}</div>}
              </div>
            ))}
            {!loading && items.length === 0 && <div>No tenés turnos en los próximos 30 días.</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientAppointments;
