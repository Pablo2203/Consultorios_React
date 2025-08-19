import React from "react";
import logo from "./logo/logo.png";
import watermark from "./assets/watermark.png";
import "./Header.css";

const Header: React.FC = () => (
  <header
    className="header"
    style={{
      backgroundImage: `url(${watermark})`,
      backgroundSize: "100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="watermark-content">
      <img src={logo} alt="Yrigoyen Consultorios Médicos" className="logo" />
      <div className="text-content">
        <h1>YRIGOYEN</h1>
        <p>CONSULTORIOS MÉDICOS</p>
      </div>
    </div>
  </header>
);

export default Header;