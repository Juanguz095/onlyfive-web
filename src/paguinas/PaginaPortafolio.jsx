import { useEffect, useState } from 'react'
import HeaderDashboard from '../componentes/dashBoardEstudiante/HeaderDashboard'
import SidebarEstudiante from '../componentes/dashBoardEstudiante/SidebarEstudiante'
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

export default function PaginaPortafolio() {
  const [publicaciones, setPublicaciones] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarPortafolio = async () => {
      const jwt = localStorage.getItem('jwt')

      if (!jwt) {
        setError('Error al cargar portafolio')
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

        const respuesta = await fetch(`http://localhost:1337/api/portafolios?filters[estudiante][id][$eq]=${usuario.id}&populate=publicaciones`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el portafolio')
        }

        const portafolio = datos.data?.[0]
        const publicacionesPortafolio = portafolio?.attributes?.publicaciones?.data || []
        setPublicaciones(publicacionesPortafolio.map(normalizarPublicacion))
      } catch {
        setError('Error al cargar portafolio')
      } finally {
        setCargando(false)
      }
    }

    cargarPortafolio()
  }, [])

  const nombreUsuario = obtenerNombreUsuario(usuario)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HeaderDashboard migaActiva="Portafolio" nombreUsuario={nombreUsuario} iniciales={obtenerIniciales(nombreUsuario)} />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante />
        <main className={estilos.main}>
          <h1 style={{ fontSize: '24px', color: '#111', marginBottom: '18px' }}>Portafolio</h1>
          {cargando && <p>Cargando...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && (
            <ul style={{ display: 'grid', gap: '10px', padding: 0, listStyle: 'none' }}>
              {publicaciones.map((publicacion) => (
                <li
                  key={publicacion.id}
                  style={{
                    padding: '14px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    background: '#f7f7f7',
                  }}
                >
                  <strong>{publicacion.titulo}</strong>
                  <div style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>
                    {publicacion.estado} | {publicacion.categoria} |{' '}
                    {publicacion.fecha_publicacion
                      ? new Date(publicacion.fecha_publicacion).toLocaleDateString('es-PE')
                      : 'Sin fecha'}
                  </div>
                </li>
              ))}
              {publicaciones.length === 0 && <li>No hay publicaciones en este portafolio.</li>}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
