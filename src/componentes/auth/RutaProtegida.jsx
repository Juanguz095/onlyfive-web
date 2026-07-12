import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ESTADO = {
  VERIFICANDO: 'verificando',
  AUTORIZADO: 'autorizado',
  BLOQUEADO: 'bloqueado',
}

export default function RutaProtegida() {
  const location = useLocation()
  const [estadoAcceso, setEstadoAcceso] = useState(ESTADO.VERIFICANDO)

  useEffect(() => {
    let activo = true

    const validarSesion = async () => {
      const jwt = localStorage.getItem('jwt')

      if (!jwt) {
        if (activo) setEstadoAcceso(ESTADO.BLOQUEADO)
        return
      }

      try {
        const respuesta = await fetch('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })

        if (!respuesta.ok) {
          throw new Error('Token invalido o expirado')
        }

        if (activo) setEstadoAcceso(ESTADO.AUTORIZADO)
      } catch {
        localStorage.removeItem('jwt')
        if (activo) setEstadoAcceso(ESTADO.BLOQUEADO)
      }
    }

    setEstadoAcceso(ESTADO.VERIFICANDO)
    validarSesion()

    return () => {
      activo = false
    }
  }, [location.pathname])

  if (estadoAcceso === ESTADO.VERIFICANDO) {
    return <p style={{ padding: '24px' }}>Verificando sesión...</p>
  }

  if (estadoAcceso === ESTADO.BLOQUEADO) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
