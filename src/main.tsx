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
import AdminProfessionals from './pages/AdminProfessionals'
import AdminProfessionalProfile from './pages/AdminProfessionalProfile'
import ProfessionalProfilePage from './pages/ProfessionalProfile'
import ProfessionalAgenda from './pages/ProfessionalAgenda'
import PatientAppointments from './pages/PatientAppointments'
import Logout from './pages/Logout'
import RequireRole from './components/RequireRole'
import MyAccount from './pages/MyAccount'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/area-personal" element={<AreaPersonal />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservar-turno" element={<ReservarTurno />} />
        <Route path="/profesionales/:especialidad" element={<Profesionales />} />
        <Route path="/admin/pending" element={<RequireRole roles={["ADMIN"]}><AdminPendingProfessionals /></RequireRole>} />
        <Route path="/admin/appointments" element={<RequireRole roles={["ADMIN"]}><AdminAppointments /></RequireRole>} />
        <Route path="/admin/professionals" element={<RequireRole roles={["ADMIN"]}><AdminProfessionals /></RequireRole>} />
        <Route path="/admin/professionals/:userId/profile" element={<RequireRole roles={["ADMIN"]}><AdminProfessionalProfile /></RequireRole>} />
        <Route path="/me" element={<RequireRole><MyAccount /></RequireRole>} />
        <Route path="/professional/profile" element={<RequireRole roles={["PROFESSIONAL","ADMIN"]}><ProfessionalProfilePage /></RequireRole>} />
        <Route path="/professional/agenda" element={<RequireRole roles={["PROFESSIONAL","ADMIN"]}><ProfessionalAgenda /></RequireRole>} />
        <Route path="/patient/appointments" element={<RequireRole roles={["PATIENT","ADMIN"]}><PatientAppointments /></RequireRole>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
