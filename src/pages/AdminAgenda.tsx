import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getProfessionals, type ProfessionalSummary } from "../api/admin";
import { getAppointmentsByProfessional, exportAppointmentsCsvByAdmin } from "../api/admin";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function toIso(dt: Date) { return dt.toISOString().slice(0,19); }

const AdminAgenda: React.FC = () => {
  const [pros, setPros] = useState<ProfessionalSummary[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [from, setFrom] = useState(startOfDay(new Date()));
  const [to, setTo] = useState(addDays(startOfDay(new Date()), 30));
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try { setPros(await getProfessionals()); } catch {}
    })();
  }, []);

  const load = async () => {
    if (!selected) return;
    try {
      setLoading(true); setError(null);
      const data = await getAppointmentsByProfessional(Number(selected), toIso(from), toIso(to));
      setItems(data);
    } catch (e: any) { setError(e?.message || 'Error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [selected, from, to]);

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap">
          <h2>Agenda de profesional</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <label>
              Profesional:
              <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ marginLeft: 8 }}>
                <option value="">-- Elegí --</option>
                {pros.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.username}</option>
                ))}
              </select>
            </label>
            <label>
              Desde: <input type="date" value={from.toISOString().slice(0,10)} onChange={(e) => setFrom(startOfDay(new Date(e.target.value)))} />
            </label>
            <label>
              Hasta: <input type="date" value={to.toISOString().slice(0,10)} onChange={(e) => setTo(startOfDay(new Date(e.target.value)))} />
            </label>
            <button className="button" type="button" disabled={!selected} onClick={() => exportAppointmentsCsvByAdmin(Number(selected), toIso(from), toIso(to))}>Exportar CSV</button>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {items.map((a) => (
              <div key={a.id} className="card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{new Date(a.startsAt).toLocaleString()}</div>
                  <div>{a.firstName} {a.lastName}</div>
                </div>
                <div>{a.status}</div>
              </div>
            ))}
            {!loading && items.length === 0 && <div>No hay citas en el rango.</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAgenda;
