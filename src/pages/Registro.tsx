import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../App.css";
import AssistantMedia from "../components/AssistantMedia";
import asistenteVideo from "../assets/asistente_virtual_saludo.webm"; // temporal
import asistentePng from "../assets/asistente_virtual.png";

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // TODO: integrar con backend / API registro
    console.log("registro", { nombre, email });
    alert("Función de registro pendiente de integración.");
  };

  return (
    <div style={{ height: "100%" }}>
      <Header />

      <section
        className="section-gradient"
        style={{
          marginTop: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 0",
        }}
      >
        <AssistantMedia
          srcWebm={asistenteVideo}
          fallbackPng={asistentePng}
          alt="Asistente virtual"
          className="yrg-assistant yrg-assistant--area"
        />

        <div style={{ width: "min(100%, 720px)", margin: "0 auto", padding: "10rem 16px 0" }}>
          <h2 style={{textAlign:"center", color: "#ffffff"}}>Crear cuenta</h2>
          <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
            Completá tus datos para registrarte en el Área Personal.
          </p>
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", paddingLeft: "120px", width: "100%", alignItems: "center"  }}>
          <div className="card" style={{ padding: 24, alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Registro</h3>
            <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585", fontWeight: 600 }}>Nombre y Apellido</span>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem", textAlign:"center" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{color: "#878585", fontWeight: 600 }}>Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@dominio.com"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585" ,fontWeight: 600 }}>Contraseña</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585", fontWeight: 600 }}>Repetir contraseña</span>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="********"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem" }}
                />
              </label>
              <button className="button" type="submit" style={{ marginTop: 8 }}>
                Crear cuenta
              </button>
            </form>

            <div style={{ marginTop: 12, fontSize: ".95rem", color: "black" }}>
              ¿Ya tenés cuenta? {" "}
              <Link to="/area-personal" style={{ color: "var(--color-primary)", fontWeight: 700, textAlign: "center" }}>
                Iniciar sesión
              </Link>
            </div>
              <div style={{ marginTop: 16 }}>
                <Link to="/">
                  <button className="button" style={{ border:"black",background: "#ffffff", color: "var(--color-primary)" }}>
                    Volver al Inicio
                  </button>
                </Link>
              </div>
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

export default Registro;
