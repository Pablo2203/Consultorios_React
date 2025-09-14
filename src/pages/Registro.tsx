import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../App.css";
import AssistantMedia from "../components/AssistantMedia";
import asistenteVideo from "../assets/asistente_virtual_saludo.webm"; // temporal
import asistentePng from "../assets/asistente_virtual.png";
import { register } from "../api/auth";

const Registro: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<'PATIENT' | 'PROFESSIONAL'>('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const logged = typeof localStorage !== 'undefined' && !!localStorage.getItem('ADMIN_TOKEN');

  function isStrongPassword(p: string): boolean {
    return /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && p.length >= 8;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setSuccess(null);
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula y número.");
      return;
    }
    if (!usuario.trim()) {
      setError("Ingresá un nombre de usuario");
      return;
    }
    try {
      setLoading(true);
      await register({ username: usuario.trim(), email: email.trim(), password, roleWanted: role });
      const baseMsg = 'Te enviamos un correo para confirmar tu cuenta. Revisá tu bandeja y seguí el enlace para activarla.';
      if (role === 'PROFESSIONAL') {
        setSuccess("Registro enviado. Tu perfil profesional quedará pendiente de aprobación por el administrador. " + baseMsg);
      } else {
        setSuccess("Cuenta creada con éxito. " + baseMsg);
      }
      // limpiar campos
      setPassword(""); setConfirm("");
    } catch (e: any) {
      const msg = e?.message || "No se pudo registrar";
      if (/Usuario ya existe/i.test(msg)) setError("El nombre de usuario ya está en uso. Elegí otro.");
      else if (/Email ya existe/i.test(msg)) setError("El email ya está en uso. Probá con otro.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
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
          <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#fff" }}>
            {logged ? "Ya estás logueado. Si querés crear otra cuenta, cerrá sesión desde el icono arriba." : (success || "Completá tus datos para registrarte en el Área Personal.")}
          </p>
        </div>

        {!logged && !success && (
        <div style={{ maxWidth: 560, margin: "0 auto", paddingLeft: "120px", width: "100%", alignItems: "center"  }}>
          <div className="card" style={{ padding: 24, alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "var(--color-primary)" }}>Registro</h3>
            <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585", fontWeight: 600 }}>Nombre</span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585", fontWeight: 600 }}>Apellido</span>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9d9", fontSize: "1rem" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#878585", fontWeight: 600 }}>Usuario</span>
                <input
                  type="text"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Elegí un usuario"
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
                {!isStrongPassword(password) && password.length > 0 && (
                  <small style={{ color: "#b00020" }}>Debe tener 8+ caracteres, con mayúscula, minúscula y número.</small>
                )}
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
              <fieldset style={{ border: 0, display: 'grid', gap: 6 }}>
                <legend style={{ color: "#878585", fontWeight: 600 }}>Tipo de cuenta</legend>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#878585' }}>
                  <input type="radio" name="rol" value="PATIENT" checked={role==='PATIENT'} onChange={() => setRole('PATIENT')} /> Paciente
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#878585' }}>
                  <input type="radio" name="rol" value="PROFESSIONAL" checked={role==='PROFESSIONAL'} onChange={() => setRole('PROFESSIONAL')} /> Profesional (aprobación requerida)
                </label>
              </fieldset>
              <button className="button" type="submit" style={{ marginTop: 8 }} disabled={!isStrongPassword(password)}>
                {loading ? "Creando…" : "Crear cuenta"}
              </button>
              {error && <div style={{ color: "#b00020" }}>{error}</div>}
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
        )}
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
