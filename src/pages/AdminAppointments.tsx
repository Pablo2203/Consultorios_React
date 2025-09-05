import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [data, pros] = await Promise.all([
          getRequestedAppointments(),
          getProfessionals().catch(() => [] as ProfessionalSummary[]),
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
  }, []);

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
    if (!items.length) return <div style={{ padding: 16 }}>No hay solicitudes pendientes.</div>;
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((a) => {
          const st = scheduleStates[a.id] || { professionalId: "", startsAt: "", loading: false };
          return (
            <div key={a.id} className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {a.firstName} {a.lastName} • {a.phone || "(sin teléfono)"}
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                <div>Especialidad: {a.specialty}</div>
                <div>Cobertura: {a.coverageType || "-"} {a.healthInsurance ? `(${a.healthInsurance})` : ""}</div>
                {a.preferredProfessional && <div>Prefiere: {a.preferredProfessional}</div>}
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: "32px 16px" }}>
        <div className="reserva-wrap">
          <h2>Solicitudes de turnos</h2>
          <p>Administra y agenda las solicitudes realizadas desde la web.</p>
          {content}
        </div>
      </section>
    </div>
  );
};

export default AdminAppointments;
