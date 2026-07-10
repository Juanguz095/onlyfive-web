import { useEffect, useState } from 'react'
import HeaderDashboard from '../componentes/dashBoardEstudiante/HeaderDashboard'
import SidebarEstudiante from '../componentes/dashBoardEstudiante/SidebarEstudiante'
import TarjetasMetricas from '../componentes/dashBoardEstudiante/TarjetasMetricas'
import ListaPublicaciones from '../componentes/dashBoardEstudiante/ListaPublicaciones'
import EncabezadoPortafolio from '../componentes/dashBoardEstudiante/EncabezadoPortafolio'
import estilos from './PaginaDashboardEstudiante.module.css'

const normalizarPublicacion = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.attributes?.titulo || '',
  estado: publicacion.attributes?.estado || 'borrador',
  categoria: publicacion.attributes?.categoria || 'Sin categoria',
  fecha_publicacion: publicacion.attributes?.fecha_publicacion || '',
})

const obtenerNombreUsuario = (usuario) => usuario?.username || usuario?.email || 'Estudiante'

const obtenerIniciales = (nombre) => (
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

export default function PaginaDashboardEstudiante() {
  const [publicaciones, setPublicaciones] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarPublicaciones = async () => {
      const jwt = localStorage.getItem('jwt')

      if (!jwt) {
        setError('Error al cargar publicaciones')
        setCargando(false)
        return
      }

      try {
        const respuestaUsuario = await fetch('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        const usuario = await respuestaUsuario.json()

        if (!respuestaUsuario.ok || !usuario.id) {
          throw new Error('No se pudo obtener el usuario')
        }

        setUsuario(usuario)

        const respuesta = await fetch('http://localhost:1337/api/publicacions/mias', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las publicaciones')
        }

        setPublicaciones((datos.data || []).map(normalizarPublicacion))
      } catch {
        setError('Error al cargar publicaciones')
      } finally {
        setCargando(false)
      }
    }

    cargarPublicaciones()
  }, [])

  const nombreUsuario = obtenerNombreUsuario(usuario)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HeaderDashboard migaActiva="Mi portafolio" nombreUsuario={nombreUsuario} iniciales={obtenerIniciales(nombreUsuario)} />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante />
        <main className={estilos.main}>
          <EncabezadoPortafolio titulo="Mi portafolio" labelPanel="Panel de estudiante" />
          {cargando && <p>Cargando...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && (
            <>
              <TarjetasMetricas publicaciones={publicaciones} />
              <ListaPublicaciones publicaciones={publicaciones} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
