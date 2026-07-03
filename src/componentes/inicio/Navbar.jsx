import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import estilos from './Navbar.module.css'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navegar = useNavigate()
  return (
    <nav className={estilos.nav}>
      <span className={estilos.logo}>I.E.S.P. Simón Bolívar</span>
      <button className={estilos.btnIniciar} onClick={() => navegar('/login')}>
        INICIAR SESIÓN
      </button>
    </nav>
  )
}
