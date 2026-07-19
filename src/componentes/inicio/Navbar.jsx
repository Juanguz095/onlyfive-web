import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import estilos from './Navbar.module.css'

const obtenerNombreUsuario = (usuario) => usuario?.username || usuario?.email || 'Estudiante'

const obtenerIniciales = (nombre) => (
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

export default function Navbar() {
  const [usuario, setUsuario] = useState(null)
  const navegar = useNavigate()

  useEffect(() => {
    let activo = true

    const cargarSesion = async () => {
      const jwt = localStorage.getItem('jwt')
      if (!jwt) {
        if (activo) setUsuario(null)
        return
      }

      try {
        const respuesta = await fetch('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })

        if (!respuesta.ok) {
          throw new Error('Sesion no valida')
        }

        const datosUsuario = await respuesta.json()
        if (activo) setUsuario(datosUsuario)
      } catch (err) {
        if (activo) setUsuario(null)
      }
    }

    cargarSesion()

    return () => {
      activo = false
    }
  }, [])

  const nombreUsuario = obtenerNombreUsuario(usuario)

  return (
    <nav className={estilos.nav}>
      <span className={estilos.logo}>I.E.S.P. Simón Bolívar</span>

      <div className={estilos.enlaces}>
        <NavLink to="/" className={({ isActive }) => `${estilos.enlace} ${isActive ? estilos.enlaceActivo : ''}`}>INICIO</NavLink>
        <NavLink to="/articulos" className={({ isActive }) => `${estilos.enlace} ${isActive ? estilos.enlaceActivo : ''}`}>ARTÍCULOS</NavLink>
        <NavLink to="/proyectos" className={({ isActive }) => `${estilos.enlace} ${isActive ? estilos.enlaceActivo : ''}`}>PROYECTOS</NavLink>
      </div>

      {!usuario ? (
        <button className={estilos.btnIniciar} onClick={() => navegar('/login')}>
          INICIAR SESIÓN
        </button>
      ) : (
        <button className={`${estilos.btnIniciar} ${estilos.btnUsuario}`} onClick={() => navegar('/dashboard')}>
          <span className={estilos.avatarUsuario}>{obtenerIniciales(nombreUsuario)}</span>
          <span className={estilos.nombreUsuario}>{nombreUsuario}</span>
        </button>
      )}
    </nav>
  )
}
