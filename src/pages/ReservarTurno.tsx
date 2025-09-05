import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../App.css";
import "./reserva.css";
import asistente_aplauso from "../assets/asistente_aplaudiendo_vp9alpha.webm";
import {
  createAppointmentRequest,
  mapEspecialidadToEnum,
} from "../api/appointments";

const OBRAS_SOCIALES = [
  "OSDE",
  "OMINT",
  "Galeno",
  "Swiss Medical",
  "Medicus",
  "Sancor Salud",
  "IOMA",
  "Unión Personal",
  "PAMI",
  "Accord Salud",
  "OSDEPYM",
  "OSMECON",
  "IOSFA",
  "OSECAC",
  "Otra",
] as const;

type TipoCobertura = "obra" | "particular";
type Especialidad = "Psiquiatría" | "Psicología" | "Cardiología";

const PROFESIONALES: Record<Especialidad, string[]> = {
  "Psiquiatría": ["Fabian Lamaison", "Paula Garofalo"],
  "Psicología": ["Virginia San Joaquin"],
  "Cardiología": ["Pepito Flores"],
};

const ReservarTurno: React.FC = () => {
  const [tipo, setTipo] = useState<TipoCobertura>("obra");
  const [obraSocial, setObraSocial] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidad, setEspecialidad] = useState<Especialidad | "">("");
  const [profesional, setProfesional] = useState("");

  const esObra = tipo === "obra";
  const obraOptions = useMemo(() => OBRAS_SOCIALES, []);
  const profesionalesOptions = useMemo(
    () => (especialidad ? PROFESIONALES[especialidad] : []),
    [especialidad]
  );

  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    // Validaciones mínimas
    if (esObra && !obraSocial) {
      alert("Seleccioná tu Obra Social");
      return;
    }

    // 1) Registrar la solicitud en el backend
    setSending(true);
    try {
      const payload = {
        coverageType: esObra ? ("INSURANCE" as const) : ("PRIVATE" as const),
        healthInsurance: esObra ? obraSocial : null,
        specialty: mapEspecialidadToEnum(especialidad) ?? null,
        preferredProfessional:
          profesional && profesional !== "Cualquiera" ? profesional : null,
        firstName: nombre,
        lastName: apellido,
        email,
        phone: telefono,
        subject: null,
        message: null,
      };
      await createAppointmentRequest(payload);
    } catch (err) {
      console.error(err);
      // En caso de error, seguimos igual con WhatsApp para no frenar la experiencia
    } finally {
      setSending(false);
    }

    // 2) Abrir WhatsApp con mensaje precargado
    const numero = "5491140443283"; // mismo que en el footer
    const partes = [
      "Hola, quiero reservar un turno.",
      `Cobertura: ${esObra ? `Obra Social (${obraSocial})` : "Particular"}.`,
      `Nombre: ${nombre} ${apellido}`.trim(),
      `Email: ${email}`,
      `Teléfono: ${telefono}`,
      especialidad ? `Especialidad: ${especialidad}` : "",
      profesional ? `Profesional: ${profesional}` : "",
    ].filter(Boolean);
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(partes.join("\n"))}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ height: "100%" }}>
      <Header />

      <section
        className="section-gradient reserva-hero"
        style={{
          marginTop: 0,
          minHeight: "72vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",}}
      >
        <video
  src={asistente_aplauso}
  className="yrg-assistant yrg-assistant--base"
  autoPlay
  loop
  muted
  playsInline
/>

        <div className="reserva-wrap">
          <h2 style ={{marginTop: "80px"}}>Reservar turno</h2>
          <p>Elegí cómo querés atenderte y completá tus datos.</p>

          <div className="reserva-switch">
            <button
              type="button"
              onClick={() => setTipo("obra")}
              className={`button reserva-pill ${esObra ? "is-active" : ""}`}
            >
              Obra Social
            </button>
            <button
              type="button"
              onClick={() => setTipo("particular")}
              className={`button reserva-pill ${!esObra ? "is-active" : ""}`}
            >
              Particular
            </button>
          </div>

          <div className="card reserva-card">
            <form onSubmit={onSubmit} className="reserva-form">
              {/* Datos de contacto */}
              <label className="reserva-field">
                <span>Nombre</span>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                />
              </label>
              <label className="reserva-field">
                <span>Apellido</span>
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                />
              </label>
              <label className="reserva-field">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@dominio.com"
                />
              </label>
              <label className="reserva-field">
                <span>Número de teléfono</span>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="11 1234 5678"
                />
              </label>

              {/* Cobertura (debajo del teléfono) */}
              <div className="reserva-slot">
                {esObra ? (
                  <label className="reserva-field">
                    <span>Obra Social</span>
                    <select
                      value={obraSocial}
                      onChange={(e) => setObraSocial(e.target.value)}
                      required
                    >
                      <option value="">-- Elegí tu Obra Social --</option>
                      {obraOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="reserva-hint" style={{ color: "#555", fontSize: "1rem" }}>
                    Atención Particular: abonás la consulta en el consultorio.
                  </div>
                )}
              </div>

              {/* Disclaimer cobertura */}
              <div className="reserva-disclaimer">
                No todos los profesionales atienden por Obra Social ni por todas las Obras
                Sociales mencionadas. Este campo es informativo para poder ofrecerte asistencia con tu
                cobertura en lo posible.
              </div>

              {/* Especialidad y profesionales */}
              <label className="reserva-field">
                <span>Especialidad</span>
                <select
                  value={especialidad}
                  onChange={(e) => {
                    setEspecialidad(e.target.value as Especialidad);
                    setProfesional("");
                  }}
                  required
                >
                  <option value="">-- Elegí la especialidad --</option>
                  <option value="Psiquiatría">Psiquiatría</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Cardiología">Cardiología</option>
                </select>
              </label>

              {especialidad && (
                <label className="reserva-field">
                  <span>Profesionales</span>
                  <select
                    value={profesional}
                    onChange={(e) => setProfesional(e.target.value)}
                    required
                  >
                    <option value="">-- Elegí el profesional --</option>
                    <option value="Cualquiera">Cualquiera</option>
                    {profesionalesOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <button className="button" type="submit">
                Continuar
              </button>
            </form>
          </div>

          <div className="reserva-links">
            <Link to="/">Volver al inicio</Link>
          </div>
        </div>
      </section>

      <footer style={{ background: "var(--color-primary)", color: "#fff", padding: "1.5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          © {new Date().getFullYear()} YRIGOYEN Consultorios Médicos
        </div>
      </footer>
    </div>
  );
};

export default ReservarTurno;
