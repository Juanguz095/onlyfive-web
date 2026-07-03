import { ChevronDown, Bell } from 'lucide-react'
import estilos from './HeaderDashboard.module.css'

export default function HeaderDashboard({ migaActiva, nombreUsuario, iniciales }) {
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
        <div className={estilos.perfilChip}>
          <div className={estilos.avatar}>
            <span>{iniciales}</span>
          </div>
          <span className={estilos.nombreUsuario}>{nombreUsuario}</span>
          <ChevronDown size={13} color="#999" />
        </div>
      </div>
    </header>
  )
}