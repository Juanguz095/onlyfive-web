import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import estilos from './SeccionReacciones.module.css'

const TIPOS_REACCION = [
  { tipo: 'like', label: '👍 Like' },
  { tipo: 'love', label: '❤️ Love' },
  { tipo: 'celebration', label: '🎉 Celebración' },
  { tipo: 'idea', label: '💡 Idea' },
]

export default function SeccionReacciones({ articuloId }) {
  const navegar = useNavigate()
  const [reacciones, setReacciones] = useState([])
  const [usuarioId, setUsuarioId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const jwt = localStorage.getItem('jwt')

  const cargarReacciones = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:1337/api/reacciones?filters[articulo][id][$eq]=${articuloId}&populate=usuario&pagination[pageSize]=200`
      )
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar reacciones')
      }

      setReacciones(datos.data || [])
    } catch {
      setError('No se pudieron cargar reacciones')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarReacciones()
  }, [articuloId])

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!jwt) {
        setUsuarioId(null)
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

        const usuario = await respuesta.json()
        setUsuarioId(usuario.id)
      } catch {
        localStorage.removeItem('jwt')
        setUsuarioId(null)
      }
    }

    cargarUsuario()
  }, [jwt])

  const reaccionesPorTipo = useMemo(() => {
    const acumulado = {
      like: 0,
      love: 0,
      celebration: 0,
      idea: 0,
    }

    reacciones.forEach((reaccion) => {
      const tipo = reaccion.attributes?.tipo
      if (acumulado[tipo] !== undefined) {
        acumulado[tipo] += 1
      }
    })

    return acumulado
  }, [reacciones])

  const reaccionDelUsuario = useMemo(() => {
    if (!usuarioId) return null

    return reacciones.find((reaccion) => {
      const idReaccionUsuario = reaccion.attributes?.usuario?.data?.id
      return idReaccionUsuario === usuarioId
    })
  }, [reacciones, usuarioId])

  const manejarReaccion = async (tipo) => {
    if (!jwt) {
      navegar('/login')
      return
    }

    const reaccionMisma = reacciones.find((reaccion) => {
      const idReaccionUsuario = reaccion.attributes?.usuario?.data?.id
      return idReaccionUsuario === usuarioId && reaccion.attributes?.tipo === tipo
    })

    try {
      if (reaccionMisma) {
        const respuestaDelete = await fetch(`http://localhost:1337/api/reacciones/${reaccionMisma.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })

        if (!respuestaDelete.ok) {
          throw new Error('No se pudo eliminar la reacción')
        }
      } else {
        const respuesta = await fetch('http://localhost:1337/api/reacciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              tipo,
              articulo: articuloId,
            },
          }),
        })

        if (!respuesta.ok) {
          throw new Error('No se pudo registrar la reacción')
        }
      }

      await cargarReacciones()
    } catch {
      setError('No se pudo registrar la reacción')
    }
  }

  return (
    <section className={estilos.seccion}>
      <h3 className={estilos.titulo}>Reacciones</h3>

      {cargando && <p className={estilos.estado}>Cargando reacciones...</p>}
      {!cargando && error && <p className={estilos.estado}>{error}</p>}

      <div className={estilos.gridReacciones}>
        {TIPOS_REACCION.map((opcion) => {
          const activa = reaccionDelUsuario?.attributes?.tipo === opcion.tipo
          return (
            <button
              key={opcion.tipo}
              className={`${estilos.chipRespuesta} ${activa ? estilos.chipActiva : ''}`}
              onClick={() => manejarReaccion(opcion.tipo)}
            >
              <span>{opcion.label}</span>
              <strong>{reaccionesPorTipo[opcion.tipo] || 0}</strong>
            </button>
          )
        })}
      </div>
    </section>
  )
}
