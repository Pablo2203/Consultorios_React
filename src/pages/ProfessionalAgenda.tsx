import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import { getMyAppointments, exportMyAppointmentsCsv } from "../api/professional";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function toIso(dt: Date) { return dt.toISOString().slice(0,19); }

const ProfessionalAgenda: React.FC = () => {
  const [from, setFrom] = useState(startOfDay(new Date()));
  const [to, setTo] = useState(addDays(startOfDay(new Date()), 30));
  const [granularity, setGranularity] = useState<10|60>(60);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMyAppointments(toIso(from), toIso(to));
        setItems(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando agenda");
      } finally { setLoading(false); }
    })();
  }, [from, to]);

  const slots = useMemo(() => {
    const out: { t: Date; busy: any | null }[] = [];
    const step = granularity;
    for (let d = new Date(from); d <= to; d = new Date(d.getTime() + step*60000)) {
      const match = items.find((a) => {
        const s = new Date(a.startsAt).getTime();
        const e = a.endsAt ? new Date(a.endsAt).getTime() : s + 50*60000;
        const t = d.getTime();
        return t >= s && t < e;
      }) || null;
      out.push({ t: new Date(d), busy: match });
    }
    return out;
  }, [items, from, to, granularity]);

  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap">
          <h2>Mi Agenda</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label>
              Desde: <input type="date" value={from.toISOString().slice(0,10)} onChange={(e) => setFrom(startOfDay(new Date(e.target.value)))} />
            </label>
            <label>
              Hasta: <input type="date" value={to.toISOString().slice(0,10)} onChange={(e) => setTo(startOfDay(new Date(e.target.value)))} />
            </label>
            <label>
              Granularidad:
              <select value={granularity} onChange={(e) => setGranularity(Number(e.target.value) as any)}>
                <option value={60}>1 hora</option>
                <option value={10}>10 minutos</option>
              </select>
            </label>
            <button className="button" type="button" onClick={() => exportMyAppointmentsCsv(toIso(from), toIso(to))}>Exportar CSV</button>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6, marginTop: 16 }}>
            {slots.map((s, i) => (
              <div key={i} title={s.busy ? `${s.busy.firstName} ${s.busy.lastName}` : "Libre"}
                   style={{ padding: 8, borderRadius: 6, background: s.busy ? "#ffd9d9" : "#e8f5e9", display: "flex", justifyContent: "space-between" }}>
                <div>{s.t.toLocaleString()}</div>
                <div>{s.busy ? `Ocupado` : `Libre`}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalAgenda;
