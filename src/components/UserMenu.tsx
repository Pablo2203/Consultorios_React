import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";
import userIcon from "../images/icono_usuario.png";

function getRoles(): string[] {
  try {
    const raw = localStorage.getItem("ADMIN_ROLES");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map((r) => String(r).toUpperCase()) : [];
  } catch {
    return [];
  }
}

function isLogged(): boolean {
  try {
    return !!localStorage.getItem("ADMIN_TOKEN");
  } catch {
    return false;
  }
}

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(isLogged());
  const [roles, setRoles] = useState<string[]>(getRoles());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    // refresh on focus (e.g., after login)
    const onFocus = () => {
      setLogged(isLogged());
      setRoles(getRoles());
    };
    window.addEventListener("focus", onFocus);
    // custom auth-updated event to react immediately after login
    const onAuthUpdated = () => {
      setLogged(isLogged());
      setRoles(getRoles());
    };
    window.addEventListener("auth-updated", onAuthUpdated as any);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("auth-updated", onAuthUpdated as any);
    };
  }, []);

  if (!logged) return <div className="user-menu" ref={ref} />;

  const isAdmin = roles.includes("ADMIN");
  const isPro = roles.includes("PROFESSIONAL");
  const isPatient = roles.includes("PATIENT");

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu__btn" onClick={() => setOpen((v) => !v)} aria-label="Menú de usuario">
        <img src={userIcon} alt="Usuario" className="user-menu__icon" />
      </button>
      {open && (
        <div className="user-menu__dropdown">
          <Link to="/me" className="user-menu__item">Mi usuario</Link>
          {isAdmin && (
            <>
              <Link to="/admin/appointments" className="user-menu__item">Turnos</Link>
              <Link to="/admin/professionals" className="user-menu__item">Profesionales</Link>
              <Link to="/admin/pending" className="user-menu__item">Pendientes</Link>
            </>
          )}
          {isPro && (
            <>
              <Link to="/professional/agenda" className="user-menu__item">Mi agenda</Link>
              <Link to="/professional/profile" className="user-menu__item">Mi perfil</Link>
            </>
          )}
          {isPatient && (
            <Link to="/patient/appointments" className="user-menu__item">Mis turnos</Link>
          )}
          <Link to="/logout" className="user-menu__item user-menu__logout">Cerrar sesión</Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
