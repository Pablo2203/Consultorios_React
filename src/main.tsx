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
import AdminUsers from './pages/AdminUsers'
import AdminProfessionalProfile from './pages/AdminProfessionalProfile'
import AdminCalendar from './pages/AdminCalendar'
import ProfessionalProfilePage from './pages/ProfessionalProfile'
import ProfessionalAgenda from './pages/ProfessionalAgenda'
import PatientAppointments from './pages/PatientAppointments'
import Logout from './pages/Logout'
import RequireRole from './components/RequireRole'
import MyAccount from './pages/MyAccount'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ConfirmEmail from './pages/ConfirmEmail'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/area-personal" element={<AreaPersonal />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvide-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirmar-email" element={<ConfirmEmail />} />
        <Route path="/reservar-turno" element={<ReservarTurno />} />
        <Route path="/profesionales/:especialidad" element={<Profesionales />} />
        <Route path="/admin/pending" element={<RequireRole roles={["ADMIN"]}><AdminPendingProfessionals /></RequireRole>} />
        <Route path="/admin/appointments" element={<RequireRole roles={["ADMIN"]}><AdminAppointments /></RequireRole>} />
        <Route path="/admin/professionals" element={<RequireRole roles={["ADMIN"]}><AdminProfessionals /></RequireRole>} />
        <Route path="/admin/users" element={<RequireRole roles={["ADMIN"]}><AdminUsers /></RequireRole>} />
        <Route path="/admin/professionals/:userId/profile" element={<RequireRole roles={["ADMIN"]}><AdminProfessionalProfile /></RequireRole>} />
        <Route path="/admin/calendar" element={<RequireRole roles={["ADMIN"]}><AdminCalendar /></RequireRole>} />
        <Route path="/me" element={<RequireRole><MyAccount /></RequireRole>} />
        <Route path="/professional/profile" element={<RequireRole roles={["PROFESSIONAL","ADMIN"]}><ProfessionalProfilePage /></RequireRole>} />
        <Route path="/professional/agenda" element={<RequireRole roles={["PROFESSIONAL","ADMIN"]}><ProfessionalAgenda /></RequireRole>} />
        <Route path="/patient/appointments" element={<RequireRole roles={["PATIENT","ADMIN"]}><PatientAppointments /></RequireRole>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
