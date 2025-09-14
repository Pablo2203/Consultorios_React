import React from 'react';

const Footer: React.FC = () => (
  <footer style={{ background: 'var(--color-primary)', color: '#fff', padding: '1.5rem 0', marginTop: 0 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
      © {new Date().getFullYear()} YRIGOYEN Consultorios Médicos
    </div>
  </footer>
);

export default Footer;
