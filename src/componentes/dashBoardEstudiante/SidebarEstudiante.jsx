import { useNavigate } from 'react-router-dom'
import { Home, MessageCircle, LayoutGrid, Video, Bell, Plus } from 'lucide-react'
import estilos from './SidebarEstudiante.module.css'

export default function SidebarEstudiante({ vistaActiva = 'dashboard', onNuevaPublicacion }) {
  const navegar = useNavigate()

  const manejarNuevaPublicacion = () => {
    if (onNuevaPublicacion) {
      onNuevaPublicacion()
      return
    }

    navegar('/dashboard?nueva=1')
  }

  return (
    <aside className={estilos.sidebar}>
      <div className={estilos.bloqueMenu}>
        <span className={estilos.labelSidebar}>MENÚ</span>
        <nav className={estilos.navSidebar}>
          <button className={estilos.itemMenu} onClick={() => navegar('/')}>
            <Home size={16} />
            <span>Inicio</span>
          </button>
          <button className={estilos.itemMenu}>
            <MessageCircle size={16} />
            <span>Foro académico</span>
          </button>
          <button
            className={`${estilos.itemMenu} ${vistaActiva === 'dashboard' ? estilos.itemActivo : ''}`}
            onClick={() => navegar('/dashboard')}
          >
            <LayoutGrid size={16} color={vistaActiva === 'dashboard' ? '#4361ee' : '#666'} />
            <span>Mi portafolio</span>
          </button>

          <button className={estilos.itemMenu}>
            <Video size={16} />
            <span>Tutoriales</span>
          </button>
          <button className={estilos.itemMenu}>
            <Bell size={16} />
            <span>Notificaciones</span>
            <span className={estilos.badgeNotif}>2</span>
          </button>
        </nav>
      </div>

      <div className={estilos.bloqueAcciones}>
        <span className={estilos.labelSidebar}>ACCIONES</span>
        <button className={estilos.btnNuevaPublicacion} onClick={manejarNuevaPublicacion}>
          <Plus size={15} />
          <span>Nueva publicación</span>
        </button>
      </div>
    </aside>
  )
}
