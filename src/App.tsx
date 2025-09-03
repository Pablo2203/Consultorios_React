import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header.tsx";
import logo from "./logo/logo.png";
import "./App.css";
import asistente from "./assets/asistente_virtual_saludo.webm";



const App: React.FC = () => {
  return (
    <div style={{ height: "100%" }} >
      <Header />

      {/* Hero Section */}
<section 
  className="section-gradient home-hero" 
  style={{ 
    marginTop: "-96px", /* empuja hacia arriba pero evita solape */
    minHeight: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center" 
  }}
>{/* Capa base: figura completa, estática */}
<video
  src={asistente}
  className="yrg-assistant yrg-assistant--base"
  autoPlay
  loop
  muted
  playsInline
/>

 <div style={{ width: "min(100%, 600px)", margin: "0 auto", padding: "2rem" }}>
          <h2  style={{justifyContent:"center", textAlign: "center"}}>Comprometidos con tu salud</h2>
          <p style={{justifyContent:"center", textAlign: "center", fontSize: "1.2rem"}}>
            Tu bienestar es nuestra prioridad.<br />
            Profesionalidad, implicación e innovación.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/area-paciente">
              <button className="button" style={{ background: "#13a6b0" }}>Área Paciente</button>
            </Link>
            <Link to="/reservar-turno">
              <button className="button" style={{ background: "white", color: "var(--color-primary)" }}>Turnos</button>
            </Link>
          </div>
      </div>
      </section>

      {/* Especialidades */}
      <section style={{ padding: "3rem 0", background: "var(--color-bg)" }}>
        <h2 style={{ textAlign: "center", color: "var(--color-primary)" }}>Nuestras Especialidades</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
          <div className="card">
            <img src="src/images/psiquiatria.png" alt="Psiquiatría" />
            <div style={{ padding: "1rem" }}>Psiquiatría</div>
          </div>
          <div className="card">
            <img src="src/images/psicologia.png" alt="Psiquiatría" />
            <div style={{ padding: "1rem" }}>Psicología</div>
          </div>
          <div className="card">
            <img src="src/images/cardiologia.png" alt="Cardiología" />
            <div style={{ padding: "1rem" }}>Cardiología</div>
          </div>
        </div>
    
      </section>

      

      {/* Footer */}
      <footer style={{ background: "var(--color-primary)", color: "#fff", padding: "2rem 0", marginTop: "3rem" }}>
       
        
          
       {/* === BLOQUE CONTACTO + MAPA + BADGE GOOGLE (aislado) === */}
<section className="yrg-contact-map">
  <div className="yrg-contact">
    <h3 className="yrg-title">¡Te esperamos!</h3>

    <div className="yrg-field">
      <div className="yrg-label">Dirección:</div>
      <div>Hipólito Yrigoyen 261, Monte Grande, Buenos Aires, Argentina</div>
    </div>

    <div className="yrg-field">
      <div className="yrg-label">Horario:</div>
      <div>Lunes a Viernes 9:00 – 21:00</div>
    </div>

    <div className="yrg-field">
      <div className="yrg-label">Teléfono:</div>
      <div>+54 11 4296-4063</div>
    </div>

    <div className="yrg-field">
      <div className="yrg-label">Correo electrónico:</div>
      <div>consultoriosyrigoyen@gmail.com</div>
    </div>
    <a
      className="yrg-btn"
      href="mailto:consultoriosyrigoyen@gmail.com?subject=Consulta%20desde%20la%20web&body=Hola%2C%20quisiera%20hacer%20una%20consulta%20sobre..."
    >
      Contáctanos
    </a>
    
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex",  alignItems: "center", flexWrap: "wrap" }}>
  <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" />
  <br />
  <div style={{ marginTop: "1rem" }}>© {new Date().getFullYear()} YRIGOYEN Consultorios Médicos</div>
</div>
  </div>

  <div className="yrg-mapwrap">
    <iframe
      title="Ubicación Consultorios Yrigoyen"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={
        "https://www.google.com/maps?q=" +
        encodeURIComponent("Hipólito Yrigoyen 261, Monte Grande, Buenos Aires, Argentina") +
        "&output=embed"
      }
    />
    
  </div>

  {/* Etiqueta lateral (opcional). Comentala si no la querés */}
  <Link
    className="yrg-reserva"
    to="/reservar-turno"
    aria-label="Reservar cita"
  >
    RESERVA TURNO
  </Link>
</section>

{/* Redes sociales debajo del mapa */}
<section className="yrg-social">
  {/* Badge Google */}
<div className="yrg-google-badge">
  <div className="yrg-google">Google</div>
  <div className="yrg-stars" aria-label="Valoración">★★★★★</div>
 
  <a
    className="yrg-link"
    target="_blank"
    rel="noreferrer"
    href={
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Consultorios Yrigoyen, Hipólito Yrigoyen 261, Monte Grande")
    }
  >
    Ver reseñas en Google
  </a>

</div>
  <div className="yrg-social__row">
    {/* Instagram */}
    <a
      className="yrg-social__btn yrg-social__btn--ig"
      href="https://www.instagram.com/consultoriosyrigoyen/"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram Consultorios Yrigoyen"
      title="Instagram"
    >
      {/* ícono Instagram (inline SVG) */}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.75z"/>
      </svg>
    </a>

    {/* Facebook */}
    <a
      className="yrg-social__btn yrg-social__btn--fb"
      href="https://www.facebook.com/consultorios.yrigoyen.monte.grande/"
      target="_blank"
      rel="noreferrer"
      aria-label="Facebook Consultorios Yrigoyen"
      title="Facebook"
    >
      {/* ícono Facebook */}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v1.9H7v3h2.6v8h3.9z"/>
      </svg>
    </a>

    {/* WhatsApp */}
    <a
      className="yrg-social__btn yrg-social__btn--wa"
      href="https://wa.me/5491140443283"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Consultorios Yrigoyen"
      title="WhatsApp"
    >
      {/* ícono WhatsApp */}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A10.5 10.5 0 0 0 3.7 18.6L3 21l2.5-.7a10.5 10.5 0 0 0 15-16.8zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.4.7.7-2.3-.2-.3A8 8 0 1 1 20 12a8 8 0 0 1-8 8zm4-5.5c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.6.7-.7.8-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.4-1.7c-.1-.2 0-.3.1-.4l.3-.4a1.4 1.4 0 0 0 .2-.4.4.4 0 0 0 0-.4c0-.1-.5-1.2-.7-1.6s-.4-.3-.6-.3h-.4a.8.8 0 0 0-.6.3 2.6 2.6 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 9.9 9.9 0 0 0 3.9 3.6 6.7 6.7 0 0 0 1.9.7 1.7 1.7 0 0 0 1.6-.9 2 2 0 0 0 .1-1.1c-.1-.1-.2-.1-.4-.2z"/>
      </svg>
    </a>
  </div>
</section>

      </footer>
    </div>
  );
};

export default App;
