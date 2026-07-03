import HeaderDashboard from '../componentes/dashBoardEstudiante/HeaderDashboard'
import SidebarEstudiante from '../componentes/dashBoardEstudiante/SidebarEstudiante'
import TarjetasMetricas from '../componentes/dashBoardEstudiante/TarjetasMetricas'
import ListaPublicaciones from '../componentes/dashBoardEstudiante/ListaPublicaciones'
import EncabezadoPortafolio from '../componentes/dashBoardEstudiante/EncabezadoPortafolio'
import AccionesPortafolio from '../componentes/dashBoardEstudiante/AccionesPortafolio'
import estilos from './PaginaDashboardEstudiante.module.css'

const publicaciones = [
  {
    titulo: 'Torta tres leches con frutos rojos',
    estado: 'Publicada',
    categoria: 'Postre',
    nivel: 'Básico',
    tiempo: '45 min',
    visitas: '34 visitas',
  },
  {
    titulo: 'Chicha morada de maracuyá',
    estado: 'Publicada',
    categoria: 'Bebida',
    nivel: 'Intermedio',
    tiempo: '30 min',
    visitas: '21 visitas',
  },
  {
    titulo: 'Alfajores de maicena',
    estado: 'Borrador',
    categoria: 'Dulce',
    nivel: 'Básico',
    tiempo: '50 min',
    visitas: 'Pendiente de revisión',
  },
]

export default function PaginaDashboardEstudiante() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HeaderDashboard migaActiva="Mi portafolio" nombreUsuario="María García" iniciales="MG" />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante />
        <main className={estilos.main}>
          <EncabezadoPortafolio />
          <TarjetasMetricas publicaciones={12} publicadas={9} borradores={2} visitas={248} />
          <ListaPublicaciones publicaciones={publicaciones} />
        </main>
      </div>
    </div>
  )
}