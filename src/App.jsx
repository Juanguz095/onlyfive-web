import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaInicio from './paguinas/PaginaInicio'
import PaginaInicioSesion from './paguinas/PaginaInicioSesion'
import PaginaDashboard from './paguinas/PaginaDashboardEstudiante'
import PaginaPortafolio from './paguinas/PaginaPortafolio'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaInicioSesion />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/portafolio" element={<PaginaPortafolio />} />
      </Routes>
    </BrowserRouter>
  )
}
