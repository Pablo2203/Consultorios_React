import React, { useState } from 'react';
import Header from '../Header';
import { requestPasswordReset } from '../api/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setOk(null);
    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      setOk('Si el email existe, te enviamos un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada.');
    } catch (e: any) {
      setError(e?.message || 'No se pudo enviar el email');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: 16 }}>
        <div className="reserva-wrap" style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2>Olvidé mi contraseña</h2>
          <p>Ingresá tu correo electrónico para recibir un enlace de restablecimiento.</p>
          <form onSubmit={onSubmit} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Email</span>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="tuemail@dominio.com" />
            </label>
            <button className="button" type="submit" disabled={loading}>{loading? 'Enviando…':'Enviar enlace'}</button>
            {error && <div style={{ color: '#b00020' }}>{error}</div>}
            {ok && <div style={{ color: '#0a7d2c' }}>{ok}</div>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;

