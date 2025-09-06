import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo/logo.png";
import "./Header.css";

const Header: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = () => {
      const tokenOk = !!(typeof localStorage !== "undefined" && localStorage.getItem("ADMIN_TOKEN"));
      setIsAuth(tokenOk);
      try {
        const roles = JSON.parse(localStorage.getItem("ADMIN_ROLES") || "[]");
        setIsPro(Array.isArray(roles) && roles.map((r: string) => r.toUpperCase()).includes("PROFESSIONAL"));
      } catch {}
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ADMIN_TOKEN" || e.key === "ADMIN_ROLES") check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="header">
      <div className="watermark-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Link to="/" className="brand-link" aria-label="Ir al inicio">
          <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" />
          <div className="text-content">
            <h1>YRIGOYEN</h1>
            <p>CONSULTORIOS MÉDICOS</p>
          </div>
        </Link>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isAuth ? (
            <>
              <Link to="/admin/appointments" className="button">Admin</Link>
              {isPro && (
                <>
                  <Link to="/professional/profile" className="button">Perfil</Link>
                  <Link to="/professional/agenda" className="button">Agenda</Link>
                </>
              )}
              <button
                className="button"
                onClick={() => {
                  localStorage.removeItem("ADMIN_TOKEN");
                  localStorage.removeItem("ADMIN_ROLES");
                  window.location.reload();
                }}
                style={{ background: "#e74c3c" }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="button">Acceder</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
