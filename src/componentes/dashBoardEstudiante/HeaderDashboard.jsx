import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import estilos from './HeaderDashboard.module.css'

export default function HeaderDashboard({ migaActiva, nombreUsuario, iniciales }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const contenedorMenuRef = useRef(null)
  const navegar = useNavigate()

  useEffect(() => {
    const manejarClickFuera = (evento) => {
      if (contenedorMenuRef.current && !contenedorMenuRef.current.contains(evento.target)) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  const toggleMenu = () => setMenuAbierto((previo) => !previo)

  const cerrarSesion = () => {
    localStorage.removeItem('jwt')
    setMenuAbierto(false)
    navegar('/login')
  }

  return (
    <header className={estilos.header}>
      <div className={estilos.logoBloque}>
        <span className={estilos.logoNombre}>I.E.S.P. Simón Bolívar</span>
        <span className={estilos.logoSub}>PROGRAMA DE ESTUDIOS DE COCINA</span>
      </div>
      <div className={estilos.migas}>
        <span className={estilos.migaInactiva}>Dashboard</span>
        <span className={estilos.migaSep}>/</span>
        <span className={estilos.migaActiva}>{migaActiva}</span>
      </div>
      <div className={estilos.headerAcciones}>
        <button className={estilos.btnCampana} aria-label="Notificaciones">
          <Bell size={16} />
        </button>
        <div className={estilos.perfilWrapper} ref={contenedorMenuRef}>
          <button
            className={estilos.perfilChip}
            onClick={toggleMenu}
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
          >
            <div className={estilos.avatar}>
              <span>{iniciales}</span>
            </div>
            <span className={estilos.nombreUsuario}>{nombreUsuario}</span>
            <ChevronDown size={13} color="#999" />
          </button>
          {menuAbierto && (
            <div className={estilos.menuPerfil} role="menu">
              <button className={estilos.menuItem} role="menuitem" onClick={cerrarSesion}>
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
