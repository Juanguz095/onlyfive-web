import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaInicio from './paguinas/PaginaInicio'
import PaginaInicioSesion from './paguinas/PaginaInicioSesion'
import PaginaDashboard from './paguinas/PaginaDashboardEstudiante'
import PaginaPortafolio from './paguinas/PaginaPortafolio'
import PaginaPortafolioPublico from './paguinas/PaginaPortafolioPublico'
import PaginaDetallePublicacion from './paguinas/PaginaDetallePublicacion'
import PaginaArticulos from './paguinas/PaginaArticulos'
import PaginaDetalleArticulo from './paguinas/PaginaDetalleArticulo'
import PaginaProyectos from './paguinas/PaginaProyectos'
import RutaProtegida from './componentes/auth/RutaProtegida'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaInicioSesion />} />
        <Route path="/articulos" element={<PaginaArticulos />} />
        <Route path="/articulo/:id" element={<PaginaDetalleArticulo />} />
        <Route path="/proyectos" element={<PaginaProyectos />} />
        <Route path="/publicacion/:id" element={<PaginaDetallePublicacion />} />
        <Route path="/portafolio/publico/:slug" element={<PaginaPortafolioPublico />} />

        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<PaginaDashboard />} />
          <Route path="/portafolio" element={<PaginaPortafolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
