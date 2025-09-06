import React, { useState } from "react";
import Header from "../Header";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";
function url(path: string) { return new URL(path.replace(/^\//, ""), API_BASE || "/").toString(); }

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();
      localStorage.setItem("ADMIN_TOKEN", data.token);
      localStorage.setItem("ADMIN_ROLES", JSON.stringify(data.roles || []));
      const roles: string[] = (data.roles || []).map((r: string) => r.toUpperCase());
      if (roles.includes("ADMIN")) window.location.href = "/admin/appointments";
      else if (roles.includes("PROFESSIONAL")) window.location.href = "/professional/agenda";
      else window.location.href = "/";
    } catch (e: any) {
      setError(e?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
        <form onSubmit={onSubmit} className="card" style={{ padding: 24, width: 360, display: "grid", gap: 12 }}>
          <h2>Acceso</h2>
          <label style={{ display: "grid", gap: 4 }}>
            <span>Usuario</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            <span>Contraseña</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminLogin;
