import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import "../App.css";
import AssistantMedia from "../components/AssistantMedia";
import asistenteVideo from "../assets/asistente_de_manos_vp9alpha.webm";
import asistentePng from "../assets/asistente_virtual.png";

type SpecialtyKey = "psicologia" | "psiquiatria" | "cardiologia";

type Profesional = {
  id: string;
  nombre: string;
  estudios: string;
  experiencia: string;
  telefono?: string;
  email?: string;
  obrasSociales?: string[];
};

const profesionalesData: Record<SpecialtyKey, Profesional[]> = {
  psicologia: [
    {
      id: "virginia-san-joaquin",
      nombre: "Virginia San Joaquín",
      estudios: "Profesional graduada en la UBA",
      experiencia: "Más de 30 años de experiencia",
      telefono: "+54 11 4296-4063",
      email: "virginia@example.com",
      obrasSociales: ["OSDE"],
    },
    { id: "pepito", nombre: "Pepito Gómez", estudios: "Lic. en Psicología (UBA)", experiencia: "10 años en clínica", telefono: "+54 11 4000-1111", email: "pepito@consultorios.com" },
  ],
  psiquiatria: [
    { id: "mengano", nombre: "Dr. Mengano Pérez", estudios: "Médico Psiquiatra (UBA)", experiencia: "15 años en salud mental", telefono: "+54 11 4000-2222", email: "mengano@consultorios.com" },
  ],
  cardiologia: [
    { id: "fulano", nombre: "Dr. Fulano Rodríguez", estudios: "Cardiólogo (UBA)", experiencia: "12 años en cardiología clínica", telefono: "+54 11 4000-3333", email: "fulano@consultorios.com" },
  ],
};

const labels: Record<SpecialtyKey, string> = {
  psicologia: "Psicología",
  psiquiatria: "Psiquiatría",
  cardiologia: "Cardiología",
};

const isSpecialtyKey = (v: string): v is SpecialtyKey =>
  v === "psicologia" || v === "psiquiatria" || v === "cardiologia";

const Profesionales: React.FC = () => {
  const params = useParams();
  const especialidadParam = (params.especialidad || "").toLowerCase();

  const especialidad: SpecialtyKey | null = useMemo(() => {
    return isSpecialtyKey(especialidadParam) ? especialidadParam : null;
  }, [especialidadParam]);

  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  if (!especialidad) {
    return (
      <div>
        <Header />
        <section style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}>
          <h2>Especialidad no encontrada</h2>
          <p>La especialidad solicitada no existe.</p>
          <Link className="yrg-btn" to="/">Volver al inicio</Link>
        </section>
      </div>
    );
  }

  const profesionales = profesionalesData[especialidad];

  return (
    <div style={{ height: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ marginTop: 0, minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <AssistantMedia
          srcWebm={asistenteVideo}
          fallbackPng={asistentePng}
          alt="Asistente virtual"
          className="yrg-assistant"
        />
        <div style={{ width: "min(100%, 820px)", margin: "0 auto", padding: "3rem 1rem", textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Nuestros Profesionales</h2>
          <p style={{ margin: ".25rem 0 0" }}>Especialidad: {labels[especialidad]}</p>
          <div style={{ marginTop: "1.25rem" }}>
            <Link to="/" className="yrg-btn" style={{ background: "#fff", color: "var(--color-primary)" }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}>
        {profesionales.length === 0 ? (
          <div className="card" style={{ width: "100%", padding: "1rem", cursor: "default" }}>
            <h3 style={{ margin: 0 }}>Próximamente</h3>
            <p style={{ marginTop: ".5rem" }}>
              Aún no hay profesionales cargados en {labels[especialidad]}.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {profesionales.map((p) => {
              const abierto = seleccionado === p.id;
              return (
                <div key={p.id} className="card" style={{ width: "100%", textAlign: "left" }}>
                  <button
                    onClick={() => setSeleccionado(abierto ? null : p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      padding: "1rem 1rem 0.75rem",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--color-text)",
                    }}
                    aria-expanded={abierto}
                    aria-controls={`prof-${p.id}`}
                  >
                    <span>{p.nombre}</span>
                    <span aria-hidden>{abierto ? "−" : "+"}</span>
                  </button>
                  {abierto && (
                    <div id={`prof-${p.id}`} style={{ padding: "0 1rem 1rem", color: "#444" }}>
                      <p style={{ margin: ".5rem 0" }}>
                        <strong>Estudios:</strong> {p.estudios}
                      </p>
                      <p style={{ margin: ".25rem 0" }}>
                        <strong>Experiencia:</strong> {p.experiencia}
                      </p>
                      {p.telefono && (
                        <p style={{ margin: ".25rem 0" }}>
                          <strong>Teléfono:</strong> {p.telefono}
                        </p>
                      )}
                      {p.email && (
                        <p style={{ margin: ".25rem 0" }}>
                          <strong>Email:</strong> {p.email}
                        </p>
                      )}
                      {p.obrasSociales?.length ? (
                        <p style={{ margin: ".25rem 0" }}>
                          <strong>Obras sociales:</strong> {p.obrasSociales.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer style={{ background: "var(--color-primary)", color: "#fff", padding: "1.5rem 0", marginTop: "2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          © {new Date().getFullYear()} YRIGOYEN Consultorios Médicos
        </div>
      </footer>
    </div>
  );
};

export default Profesionales;
