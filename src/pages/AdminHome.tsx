import React from "react";
import Header from "../Header";
import { Link } from "react-router-dom";

const AdminHome: React.FC = () => {
  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap" style={{ display: 'grid', gap: 12 }}>
          <h2>Mi usuario (Admin)</h2>
          <div className="card" style={{ padding: 16, display: 'grid', gap: 8 }}>
            <Link className="button" to="/admin/appointments">Gestionar turnos</Link>
            <Link className="button" to="/admin/professionals">Profesionales</Link>
            <Link className="button" to="/admin/pending">Solicitudes pendientes</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
