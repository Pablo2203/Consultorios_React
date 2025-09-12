import React, { useEffect, useState } from "react";
import Header from "../Header";
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await getMyAccount();
        setData(me);
        setU(me.username);
        setE(me.email);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const onSave = async (e0: React.FormEvent) => {
    e0.preventDefault();
    if (!data) return;
    setError(null); setOk(null);
    if (!u.trim()) { setError("Ingresá un usuario"); return; }
    if (!validEmail(e)) { setError("Email inválido"); return; }
    try {
      setSaving(true);
      const saved = await updateMyAccount({ username: u.trim(), email: e.trim() });
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
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap" style={{ display: 'grid', gap: 16, maxWidth: 720, margin: '0 auto' }}>
          <h2>Mi usuario</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          {ok && <div style={{ color: '#0a7d2c' }}>{ok}</div>}

          {/* Datos de cuenta */}
          <form onSubmit={onSave} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <h3 style={{ margin: 0 }}>Datos de cuenta</h3>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Usuario</span>
              <input value={u} onChange={e=>setU(e.target.value)} required />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Email</span>
              <input type="email" value={e} onChange={e=>setE(e.target.value)} required />
            </label>
            <button className="button" type="submit" disabled={saving}>{saving? 'Guardando…':'Guardar'}</button>
          </form>

          {/* Contraseña */}
          <form onSubmit={onChangePass} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <h3 style={{ margin: 0 }}>Cambiar contraseña</h3>
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
            <button className="button" type="submit" disabled={pSaving}>{pSaving? 'Actualizando…':'Actualizar'}</button>
          </form>

          {isPro && (
            <div className="card" style={{ padding: 16, display: 'grid', gap: 8 }}>
              <h3 style={{ margin: 0 }}>Perfil profesional</h3>
              <p>Actualizá tu bio, especialidad y fotografía.</p>
              <Link className="button" to="/professional/profile">Editar perfil profesional</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyAccount;
