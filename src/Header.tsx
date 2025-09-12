import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo/logo.png";
import "./Header.css";
import UserMenu from "./components/UserMenu";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="watermark-content">
        <Link to="/" className="brand-link" aria-label="Ir al inicio">
          <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" />
          <div className="text-content">
            <h1>YRIGOYEN</h1>
            <p>CONSULTORIOS MÉDICOS</p>
          </div>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
