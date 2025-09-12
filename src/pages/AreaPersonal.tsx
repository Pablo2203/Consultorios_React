import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../App.css";
import "./area-personal.css";
import AssistantMedia from "../components/AssistantMedia";
import asistenteVideo from "../assets/asistente_pensando_vp9alpha.webm";
import asistentePng from "../assets/asistente_virtual.png";
import { login } from "../api/auth";

const AreaPaciente: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    try {
      setLoading(true);
      const res = await login(usernameOrEmail, password);
      localStorage.setItem("ADMIN_TOKEN", res.token);
      localStorage.setItem("ADMIN_ROLES", JSON.stringify(res.roles || []));
      // notificar al header/menú para que se actualice sin refrescar
      try { window.dispatchEvent(new Event("auth-updated")); } catch {}
      setSuccess("Te has logueado con éxito. Usá el icono de usuario para acceder a tus opciones.");
    } catch (e: any) {
      setError(e?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero Área Personal */}
      <section
        className="section-gradient area-personal"
        style={{
          marginTop: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AssistantMedia
          srcWebm={asistenteVideo}
          fallbackPng={asistentePng}
          alt="Asistente virtual"
          className="yrg-assistant yrg-assistant--area"
        />

        <div
          style={{
            width: "min(100%, 720px)",
            margin: "0 auto",
            paddingLeft: "4rem",
            paddingBottom: "-16rem",
            display: "grid",
            gap: "0.5rem",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "var(--color-bg)", margin: "2px", paddingRight: "14rem", paddingTop: "5rem" }}>Área Personal</h2>
          <p style={{ fontSize: "1.1rem", margin: 0, paddingRight: "14rem", color: "#fff" }}>
            {success
              ? "Te has logueado con éxito. Usá el icono de usuario para acceder a tus opciones."
              : "Ingresá con tu email y contraseña o registrate para comenzar."}
          </p>

          {/* Login dentro del área turquesa, centrado */}
          {!success && (
            <div style={{ width: "100%", maxWidth: 520}}>
              <div className="card" style={{ padding: 10, textAlign: "center" }}>
                <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Iniciar sesión</h3>
                <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10, textAlign: "left" }}>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>Email o usuario</span>
                    <input
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="usuario o tuemail@dominio.com"
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #d9d9d9",
                        fontSize: "1rem",
                      }}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>Contraseña</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #d9d9d9",
                        fontSize: "1rem",
                      }}
                    />
                  </label>
                  <button className="button" type="submit" style={{ marginTop: 6 }}>
                    {loading ? "Ingresando…" : "Ingresar"}
                  </button>
                  {error && <div style={{ color: "#b00020" }}>{error}</div>}
                </form>
                <div style={{ marginTop: 10, fontSize: ".95rem", textAlign: "center", color: "#555" }}>
                  ¿No tenés cuenta? {" "}
                  <Link to="/registro" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                    Registrarme
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

     

      {/* Footer mínimo para consistencia visual */}
      <footer style={{ background: "var(--color-primary)", color: "#fff", padding: "1.5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          © {new Date().getFullYear()} YRIGOYEN Consultorios Médicos
        </div>
      </footer>
    </div>
  );
};

export default AreaPaciente;
