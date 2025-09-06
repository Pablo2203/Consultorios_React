import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AreaPersonal from './pages/AreaPersonal'
import Registro from './pages/Registro'
import ReservarTurno from './pages/ReservarTurno'
import Profesionales from './pages/Profesionales'
import AdminPendingProfessionals from './pages/AdminPendingProfessionals'
import AdminAppointments from './pages/AdminAppointments'
import AdminLogin from './pages/AdminLogin'
import AdminProfessionals from './pages/AdminProfessionals'
import AdminProfessionalProfile from './pages/AdminProfessionalProfile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/area-personal" element={<AreaPersonal />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservar-turno" element={<ReservarTurno />} />
        <Route path="/profesionales/:especialidad" element={<Profesionales />} />
        <Route path="/admin/pending" element={<AdminPendingProfessionals />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/professionals" element={<AdminProfessionals />} />
        <Route path="/admin/professionals/:userId/profile" element={<AdminProfessionalProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
