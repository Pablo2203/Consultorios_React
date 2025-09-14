import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { getMyAppointmentsAsPatient, exportMyAppointmentsCsvAsPatient, cancelMyAppointment } from "../api/patient";
import SimpleCalendar from "../components/SimpleCalendar";

function isoLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
}

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
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
        const to = new Date(from); to.setDate(to.getDate() + 30); to.setHours(23,59,59,0);
        const f = isoLocal(from); const t = isoLocal(to);
        setFromIso(f); setToIso(t);
        const data = await getMyAppointmentsAsPatient(f, t);
        setItems(data || []);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const events = useMemo(() => (items || []).map((a: any) => ({
    id: a.id,
    start: new Date(a.startsAt),
    title: `${a.startsAt?.slice(11,16) ?? ''} ${a.specialty ?? ''}`.trim(),
    onClick: async () => {
      if (confirm('¿Querés cancelar este turno?')) {
        try {
          await cancelMyAppointment(a.id);
          // refrescar
          setItems(prev => prev.filter(x => x.id !== a.id));
        } catch (e: any) { alert(e?.message || 'No se pudo cancelar'); }
      }
    }
  })), [items]);

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16, flex: 1 }}>
        <div className="reserva-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Mis turnos (próximos 30 días)</h2>
            <button className="button" onClick={() => exportMyAppointmentsCsvAsPatient(fromIso, toIso)}>Exportar CSV</button>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <SimpleCalendar startDate={new Date(fromIso)} days={30} events={events} />
          {!loading && items.length === 0 && <div style={{ marginTop: 8 }}>No tenés turnos en los próximos 30 días.</div>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PatientAppointments;
