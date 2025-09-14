import React, { useMemo, useState } from 'react';
import Header from '../Header';
import { resetPassword } from '../api/auth';

function useQueryParam(name: string): string | null {
  const params = useMemo(() => new URLSearchParams(location.search), []);
  return params.get(name);
}

const ResetPassword: React.FC = () => {
  const token = useQueryParam('token') || '';
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setOk(null);
    if (!token) { setError('Enlace inválido'); return; }
    if (p1 !== p2) { setError('Las contraseñas no coinciden'); return; }
    try {
      setLoading(true);
      await resetPassword(token, p1);
      setOk('Tu contraseña fue restablecida. Ya podés iniciar sesión.');
      setP1(''); setP2('');
    } catch (e: any) {
      setError(e?.message || 'No se pudo restablecer la contraseña');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap" style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2>Restablecer contraseña</h2>
          {!token && <div style={{ color: '#b00020' }}>Falta el token en el enlace.</div>}
          <form onSubmit={onSubmit} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Nueva contraseña</span>
              <input type="password" required value={p1} onChange={e=>setP1(e.target.value)} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Repetir contraseña</span>
              <input type="password" required value={p2} onChange={e=>setP2(e.target.value)} />
            </label>
            <button className="button" type="submit" disabled={!token || loading}>{loading? 'Actualizando…':'Restablecer'}</button>
            {error && <div style={{ color: '#b00020' }}>{error}</div>}
            {ok && <div style={{ color: '#0a7d2c' }}>{ok}</div>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;

