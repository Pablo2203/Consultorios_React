import React, { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import { confirmEmail } from '../api/auth';

const ConfirmEmail: React.FC = () => {
  const params = useMemo(() => new URLSearchParams(location.search), []);
  const token = params.get('token') || '';
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        await confirmEmail(token);
        setOk('Tu email fue confirmado. Ya podés iniciar sesión.');
      } catch (e: any) { setError(e?.message || 'No se pudo confirmar el email'); }
      finally { setLoading(false); }
    })();
  }, [token]);

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap" style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2>Confirmación de correo</h2>
          {!token && <p>Falta el token en el enlace. Revisá tu email y volvé a ingresar desde el correo.</p>}
          {loading && <div>Confirmando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          {ok && <div style={{ color: '#0a7d2c' }}>{ok}</div>}
          {!loading && !error && !ok && (
            <p>Si te registraste, te enviamos un email con un enlace para confirmar tu cuenta.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ConfirmEmail;

