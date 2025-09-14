import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { getMyAccount, updateMyAccount, changeMyPassword, type MyAccountResponse } from "../api/account";
import { Link } from "react-router-dom";

function validEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

const MyAccount: React.FC = () => {
  const [data, setData] = useState<MyAccountResponse | null>(null);
  const [u, setU] = useState("");
  const [e, setE] = useState("");
  const [cp, setCp] = useState("");
  const [np, setNp] = useState("");
  const [npc, setNpc] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pSaving, setPSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE_URL ?? '';
  const API_BASE = (typeof API_BASE_RAW === 'string' ? API_BASE_RAW.trim() : '');
  function url(path: string) {
    const p = path.startsWith('/') ? path : `/${path}`;
    if (!API_BASE) return p;
    const base = API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE;
    return `${base}${p}`;
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await getMyAccount();
        setData(me);
        // No pre-llenamos los campos; usamos placeholders con los valores actuales
        setU("");
        setE("");
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const onSave = async (e0: React.FormEvent) => {
    e0.preventDefault();
    if (!data) return;
    setError(null); setOk(null);
    const newUsername = (u.trim() || data.username || "").trim();
    const newEmail = (e.trim() || data.email || "").trim();
    if (!newUsername) { setError("Ingresá un usuario"); return; }
    if (!validEmail(newEmail)) { setError("Email inválido"); return; }
    try {
      setSaving(true);
      const saved = await updateMyAccount({ username: newUsername, email: newEmail });
      setData(saved);
      setOk("Datos guardados");
      window.dispatchEvent(new Event("auth-updated"));
    } catch (err: any) {
      const msg = err?.message || "Error";
      if (/usuario.*existe/i.test(msg)) setError("El usuario ya está en uso");
      else if (/email.*existe/i.test(msg)) setError("El email ya está en uso");
      else setError(msg);
    } finally { setSaving(false); }
  };

  const onDelete = async () => {
    if (!confirm('¿Eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(url('/api/me'), { method: 'DELETE', credentials: 'include' });
      if (!res.ok && res.status !== 204) throw new Error(`Error ${res.status}`);
      localStorage.removeItem('ADMIN_TOKEN');
      localStorage.removeItem('ADMIN_ROLES');
      window.location.href = '/';
    } catch (e: any) {
      setError(e?.message || 'No se pudo eliminar la cuenta');
    }
  };

  const onChangePass = async (e0: React.FormEvent) => {
    e0.preventDefault();
    setError(null); setOk(null);
    if (np !== npc) { setError("Las contraseñas no coinciden"); return; }
    try {
      setPSaving(true);
      await changeMyPassword({ currentPassword: cp, newPassword: np });
      setOk("Contraseña actualizada");
      setCp(""); setNp(""); setNpc("");
    } catch (err: any) { setError(err?.message || "No se pudo cambiar la contraseña"); }
    finally { setPSaving(false); }
  };

  const isPro = (data?.role || "").toUpperCase() === "PROFESSIONAL";

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: '72px 16px 24px', flex: 1, minHeight: '82vh' }}>
        <div className="reserva-wrap" style={{ display: 'grid', gap: 16, maxWidth: 720, margin: '0 auto' }}>
          <h2>Mi usuario</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          {ok && <div style={{ color: '#0a7d2c' }}>{ok}</div>}

          {/* Un contenedor único para todo: datos + contraseña + eliminar */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <h3 style={{ margin: 0 }}>Datos de cuenta</h3>
                <form onSubmit={onSave} style={{ display: 'grid', gap: 10 }}>
                  <label style={{ display: 'grid', gap: 4, textAlign: 'left' }}>
                    <span>Usuario</span>
                    <input value={u} placeholder={data?.username || '-'} onChange={e=>setU(e.target.value)} />
                  </label>
                  <label style={{ display: 'grid', gap: 4, textAlign: 'left' }}>
                    <span>Email</span>
                    <input type="email" value={e} placeholder={data?.email || '-'} onChange={e=>setE(e.target.value)} />
                  </label>
                  <div style={{ display:'flex', gap: 8, flexWrap:'wrap', justifyContent:'center' }}>
                    <button className="button" type="submit" disabled={saving}>{saving? 'Guardando…':'Guardar'}</button>
                  </div>
                </form>
              </div>

              {/* separador visual */}
              <div style={{ height: 1, background: '#eee', margin: '4px 0' }} />

              <div style={{ display: 'grid', gap: 8 }}>
                <h3 style={{ margin: 0 }}>Cambiar contraseña</h3>
                <form onSubmit={onChangePass} style={{ display: 'grid', gap: 10 }}>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Contraseña actual</span>
                    <input type="password" value={cp} onChange={e=>setCp(e.target.value)} required />
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Nueva contraseña</span>
                    <input type="password" value={np} onChange={e=>setNp(e.target.value)} required />
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Repetir nueva contraseña</span>
                    <input type="password" value={npc} onChange={e=>setNpc(e.target.value)} required />
                  </label>
                  <div style={{ display:'flex', gap: 8, flexWrap:'wrap', justifyContent:'center' }}>
                    <button className="button" type="submit" disabled={pSaving}>{pSaving? 'Actualizando…':'Actualizar'}</button>
                  </div>
                </form>
              </div>

              <div style={{ height: 1, background: '#eee', margin: '4px 0' }} />

              <div style={{ display:'grid', gap: 8 }}>
                <h3 style={{ margin: 0 }}>Eliminar mi cuenta</h3>
                <div style={{ color: '#555' }}>Esta acción es permanente.</div>
                <div style={{ display:'flex', gap: 8, flexWrap:'wrap', justifyContent:'center' }}>
                  <button className="button" style={{ background: '#b00020' }} onClick={onDelete}>Eliminar cuenta</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card de acceso a perfil profesional removida: ya existe “Mi perfil” en el menú */}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyAccount;
