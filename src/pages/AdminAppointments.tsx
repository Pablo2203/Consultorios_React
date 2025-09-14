import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import type { AppointmentResponse, ProfessionalSummary } from "../api/admin";
import { getRequestedAppointments, scheduleAppointment, getWhatsAppTemplate, getProfessionals } from "../api/admin";

type ScheduleState = {
  professionalId: string;
  startsAt: string; // value from input type datetime-local
  loading: boolean;
  error?: string;
};

function toBackendLocalDateTime(value: string): string {
  // ensure seconds present: YYYY-MM-DDTHH:mm:00
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value; // naive but effective
}

const AdminAppointments: React.FC = () => {
  const [items, setItems] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleStates, setScheduleStates] = useState<Record<number, ScheduleState>>({});
  const [professionals, setProfessionals] = useState<ProfessionalSummary[]>([]);
  // Filtros por especialidad y profesional
  const [filterSpecialty, setFilterSpecialty] = useState<string>('');
  const [filterProfessionalId, setFilterProfessionalId] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [data, pros] = await Promise.all([
          getRequestedAppointments(),
          getProfessionals(filterSpecialty || undefined).catch(() => [] as ProfessionalSummary[]),
        ]);
        setProfessionals(pros);
        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando solicitudes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterSpecialty]);

  // Filtros por especialidad/profesional aplicados en content
  // Especialidades del backend (enum)
  const specialties = ["PSICOLOGIA","PSIQUIATRIA","NUTRICION","FONOAUDIOLOGIA","CARDIOLOGIA"];
  // const preferreds = Array.from(new Set(items.map(i => i.preferredProfessional).filter(Boolean))) as string[];

  const onChangeField = (id: number, field: keyof ScheduleState, value: string | boolean | undefined) => {
    setScheduleStates((prev) => ({
      ...prev,
      [id]: {
        professionalId: prev[id]?.professionalId || "",
        startsAt: prev[id]?.startsAt || "",
        loading: typeof value === "boolean" ? (value as boolean) : prev[id]?.loading || false,
        error: prev[id]?.error,
        [field]: value,
      } as any,
    }));
  };

  const schedule = async (id: number) => {
    const s = scheduleStates[id] || { professionalId: "", startsAt: "", loading: false };
    if (!s.professionalId || !s.startsAt) {
      onChangeField(id, "error", "Profesional y fecha/hora son obligatorios");
      return;
    }
    try {
      onChangeField(id, "loading", true);
      onChangeField(id, "error", undefined);
      const body = {
        professionalId: Number(s.professionalId),
        startsAt: toBackendLocalDateTime(s.startsAt),
      };
      await scheduleAppointment(id, body);
      // Remove from list since it is no longer REQUESTED
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      onChangeField(id, "error", e?.message || "Error al agendar");
    } finally {
      onChangeField(id, "loading", false);
    }
  };

  const openWhatsAppTemplate = async (id: number) => {
    try {
      const tpl = await getWhatsAppTemplate(id);
      window.open(tpl.waLink, "_blank");
    } catch (e) {
      alert("No se pudo obtener la plantilla WhatsApp");
    }
  };

  const content = useMemo(() => {
    if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;
    if (error) return <div style={{ color: "#b00020", padding: 16 }}>{error}</div>;
    // aplicar filtros
    let filtered = items;
    if (filterSpecialty) filtered = filtered.filter(i => String(i.specialty) === filterSpecialty);
    if (filterProfessionalId) {
      const pro = professionals.find(p => String(p.id) === filterProfessionalId);
      if (pro) {
        filtered = filtered.filter(i => (i.preferredProfessional || '').toLowerCase().includes(String(pro.username).toLowerCase()));
      }
    }
    if (!filtered.length) return <div style={{ padding: 16 }}>No hay solicitudes pendientes.</div>;
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {filtered.map((a) => {
          const st = scheduleStates[a.id] || { professionalId: "", startsAt: "", loading: false };
          return (
            <div key={a.id} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {a.firstName} {a.lastName} • {a.phone || "(sin teléfono)"}
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8, justifyContent: 'center' }}>
                <div>Especialidad: {a.specialty}</div>
                <div>Cobertura: {a.coverageType || "-"} {a.healthInsurance ? `(${a.healthInsurance})` : ""}</div>
                {a.preferredProfessional && <div>Prefiere: {a.preferredProfessional}</div>}
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: 'center' }}>
                {professionals.length > 0 ? (
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span>Profesional</span>
                    <select
                      value={st.professionalId}
                      onChange={(e) => onChangeField(a.id, "professionalId", e.target.value)}
                      style={{ minWidth: 200 }}
                    >
                      <option value="">-- Elegí profesional --</option>
                      {professionals.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.username} {p.email ? `(${p.email})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span>Profesional ID</span>
                    <input
                      type="number"
                      min={1}
                      value={st.professionalId}
                      onChange={(e) => onChangeField(a.id, "professionalId", e.target.value)}
                      placeholder="Ej.: 1"
                      style={{ width: 140 }}
                    />
                  </label>
                )}
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span>Fecha y hora</span>
                  <input
                    type="datetime-local"
                    value={st.startsAt}
                    onChange={(e) => onChangeField(a.id, "startsAt", e.target.value)}
                  />
                </label>
                <button disabled={st.loading} className="button" onClick={() => schedule(a.id)}>
                  {st.loading ? "Agendando…" : "Agendar"}
                </button>
                <button type="button" className="button" onClick={() => openWhatsAppTemplate(a.id)}>
                  WhatsApp
                </button>
              </div>
              {st.error && <div style={{ color: "#b00020", marginTop: 8 }}>{st.error}</div>}
            </div>
          );
        })}
      </div>
    );
  }, [items, loading, error, scheduleStates]);

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: "24px 16px", flex: 1 }}>
        <div className="reserva-wrap">
          <h2>Solicitudes de turnos</h2>
          <div className="card" style={{ padding: 12, marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por especialidad</span>
              <select value={filterSpecialty} onChange={e=>setFilterSpecialty(e.target.value)}>
                <option value="">Todas</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por profesional</span>
              <select value={filterProfessionalId} onChange={e=>setFilterProfessionalId(e.target.value)}>
                <option value="">Todos</option>
                {professionals.map(p => <option key={p.id} value={String(p.id)}>{p.username} {p.email ? `(${p.email})` : ''}</option>)}
              </select>
            </label>
            {(filterSpecialty || filterProfessionalId) && (
              <button className="button" onClick={()=>{setFilterProfessionalId(''); setFilterSpecialty('')}}>Limpiar filtros</button>
            )}
          </div>
          <p>Administra y agenda las solicitudes realizadas desde la web.</p>
          {content}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminAppointments;
