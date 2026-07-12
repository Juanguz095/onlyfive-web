import { useEffect, useState } from 'react'
import estilos from './Navbar.module.css'
import { useNavigate } from 'react-router-dom'

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
      } catch {
        localStorage.removeItem('jwt')
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
