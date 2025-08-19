import React from "react";
import logo from "./logo/logo.png";
import "./header.css";
const Header: React.FC = () => (
  <header className="header">
    <div className="watermark">
      <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" />
      <div className="text-content">
        <h1>YRIGOYEN</h1>
        <p>CONSULTORIOS MÉDICOS</p>
      </div>
    </div>
  </header>
);

export default Header;