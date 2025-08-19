import React from "react";
import Header from "./Header.tsx";
import logo from "./logo/logo.png";
import "./App.css";

const App: React.FC = () => {
  return (
    <div style={{ height: "100%" }} >
      <Header />

      {/* Hero Section */}
      <section className="section-gradient" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem" }}>
          <h2>Comprometidos con tu salud</h2>
          <p style={{justifyContent:"center", textAlign: "center", fontSize: "1.2rem"}}>
            Tu bienestar es nuestra prioridad.<br />
            Profesionalidad, implicación e innovación.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button className="button" style={{ background: "#13a6b0", color: "" }}>Área Paciente</button>
            <button className="button" style={{ background: "white", color: "var(--color-primary)" }}>Cita Previa</button>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section style={{ padding: "3rem 0", background: "var(--color-bg)" }}>
        <h2 style={{ textAlign: "center", color: "var(--color-primary)" }}>Nuestras Especialidades</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
          <div className="card">
            <img src="src/images/psiquiatria.png" alt="Psiquiatría" style={{ width: 250, height: 180, objectFit: "cover" }} />
            <div style={{ padding: "1rem" }}>Psiquiatría</div>
          </div>
          <div className="card">
            <img src="src/images/psicologia.png" alt="Psiquiatría" style={{ width: 250, height: 180, objectFit: "cover" }} />
            <div style={{ padding: "1rem" }}>Psicología</div>
          </div>
          <div className="card">
            <img src="src/images/cardiologia.png" alt="Cardiología" style={{ width: 250, height: 180, objectFit: "cover" }} />
            <div style={{ padding: "1rem" }}>Cardiología</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--color-primary)", color: "#fff", padding: "2rem 0", marginTop: "3rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" style={{ background: "#fff", borderRadius: "50%", padding: "0.5rem" }} />
          <div style={{ marginTop: "1rem" }}>© {new Date().getFullYear()} YRIGOYEN Consultorios Médicos</div>
        </div>
        <br/>
        <div>
          <div>Dirección:  Hipólito Yrigoyen 261, Monte Grande, Buenos Aires, Argentina</div>
          <div>Teléfono: +54 11 4296-4063</div>
          <div>Correo: info@yrigoyen.com</div>
        </div>
      </footer>
    </div>
  );
};

export default App;