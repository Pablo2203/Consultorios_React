import React from "react";
import { Navigate, useLocation } from "react-router-dom";

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

type Props = {
  roles?: string[]; // allowed roles; if omitted, only requires logged-in
  children: React.ReactElement;
};

const RequireRole: React.FC<Props> = ({ roles, children }) => {
  const loc = useLocation();
  const logged = isLogged();
  const currentRoles = getRoles();

  if (!logged) {
    return <Navigate to="/area-personal" state={{ from: loc }} replace />;
    }

  if (roles && roles.length > 0) {
    const ok = currentRoles.some((r) => roles.map((x) => x.toUpperCase()).includes(r));
    if (!ok) return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
