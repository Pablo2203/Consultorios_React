import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AreaPaciente from './pages/AreaPaciente'
import Registro from './pages/Registro'
import ReservarTurno from './pages/ReservarTurno'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/area-paciente" element={<AreaPaciente />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservar-turno" element={<ReservarTurno />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
