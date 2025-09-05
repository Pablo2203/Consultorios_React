import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo/logo.png";
import "./Header.css";

const Header: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const check = () => setIsAdmin(!!(typeof localStorage !== "undefined" && localStorage.getItem("ADMIN_TOKEN")));
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ADMIN_TOKEN") check();
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
        {isAdmin && (
          <Link to="/admin/appointments" className="button" style={{ marginRight: 12 }}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
