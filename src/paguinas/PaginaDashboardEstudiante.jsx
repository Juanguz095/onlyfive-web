import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import HeaderDashboard from '../componentes/dashBoardEstudiante/HeaderDashboard'
import SidebarEstudiante from '../componentes/dashBoardEstudiante/SidebarEstudiante'
import TarjetasMetricas from '../componentes/dashBoardEstudiante/TarjetasMetricas'
import ListaPublicaciones from '../componentes/dashBoardEstudiante/ListaPublicaciones'
import EncabezadoPortafolio from '../componentes/dashBoardEstudiante/EncabezadoPortafolio'
import FormularioNuevaPublicacion from '../componentes/dashBoardEstudiante/FormularioNuevaPublicacion'
import estilos from './PaginaDashboardEstudiante.module.css'

const normalizarPublicacion = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.attributes?.titulo || '',
  descripcion: publicacion.attributes?.descripcion || '',
  estado: publicacion.attributes?.estado || 'borrador',
  categoria: publicacion.attributes?.categoria || 'Sin categoria',
  ciclo: publicacion.attributes?.ciclo || 'CICLO I',
  tipo: publicacion.attributes?.tipo || 'PROYECTOS',
  taller: publicacion.attributes?.taller || '',
  docente: publicacion.attributes?.docente || '',
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
  const location = useLocation()
  const [publicaciones, setPublicaciones] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormularioNuevaPublicacion, setMostrarFormularioNuevaPublicacion] = useState(false)
  const [enlacePublicoPortafolio, setEnlacePublicoPortafolio] = useState('')
  const [publicacionEnEdicion, setPublicacionEnEdicion] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    if (query.get('nueva') === '1') {
      setPublicacionEnEdicion(null)
      setMostrarFormularioNuevaPublicacion(true)
    }
  }, [location.search])

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

        const [respuestaPublicaciones, respuestaPortafolio] = await Promise.all([
          fetch('http://localhost:1337/api/publicacions/mias', {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }),
          fetch(`http://localhost:1337/api/portafolios?filters[estudiante][id][$eq]=${usuario.id}&sort=id:desc`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }),
        ])

        const [datosPublicaciones, datosPortafolio] = await Promise.all([
          respuestaPublicaciones.json(),
          respuestaPortafolio.json(),
        ])

        if (!respuestaPublicaciones.ok) {
          throw new Error('No se pudieron cargar las publicaciones')
        }

        if (respuestaPortafolio.ok) {
          const portafolio = datosPortafolio.data?.[0]
          const slugCompartible = portafolio?.attributes?.slug_compartible
          if (slugCompartible) {
            setEnlacePublicoPortafolio(`${window.location.origin}/portafolio/publico/${slugCompartible}`)
          }
        }

        setPublicaciones((datosPublicaciones.data || []).map(normalizarPublicacion))
      } catch {
        setError('Error al cargar publicaciones')
      } finally {
        setCargando(false)
      }
    }

    cargarPublicaciones()
  }, [])

  const manejarPublicacionCreada = (publicacionCreada) => {
    setPublicaciones((previo) => [normalizarPublicacion(publicacionCreada), ...previo])
    setPublicacionEnEdicion(null)
    setMostrarFormularioNuevaPublicacion(false)
  }

  const manejarPublicacionActualizada = (publicacionActualizada) => {
    const publicacionNormalizada = normalizarPublicacion(publicacionActualizada)

    setPublicaciones((previo) => previo.map((p) => (
      p.id === publicacionNormalizada.id ? publicacionNormalizada : p
    )))

    setPublicacionEnEdicion(null)
    setMostrarFormularioNuevaPublicacion(false)
  }

  const abrirFormularioCrear = () => {
    setPublicacionEnEdicion(null)
    setMostrarFormularioNuevaPublicacion(true)
  }

  const abrirFormularioEditar = (publicacion) => {
    setPublicacionEnEdicion(publicacion)
    setMostrarFormularioNuevaPublicacion(true)
  }

  const cerrarFormulario = () => {
    setPublicacionEnEdicion(null)
    setMostrarFormularioNuevaPublicacion(false)
  }

  const nombreUsuario = obtenerNombreUsuario(usuario)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HeaderDashboard migaActiva="Mi portafolio" nombreUsuario={nombreUsuario} iniciales={obtenerIniciales(nombreUsuario)} />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante vistaActiva="dashboard" onNuevaPublicacion={abrirFormularioCrear} />
        <main className={estilos.main}>
          <EncabezadoPortafolio
            titulo="Mi portafolio"
            labelPanel="Panel de estudiante"
            enlacePublicoPortafolio={enlacePublicoPortafolio}
          />
          {mostrarFormularioNuevaPublicacion && (
            <FormularioNuevaPublicacion
              modo={publicacionEnEdicion ? 'editar' : 'crear'}
              publicacionInicial={publicacionEnEdicion}
              onCreada={manejarPublicacionCreada}
              onActualizada={manejarPublicacionActualizada}
              onCerrar={cerrarFormulario}
            />
          )}
          {cargando && <p>Cargando...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && (
            <>
              <TarjetasMetricas publicaciones={publicaciones} />
              <ListaPublicaciones publicaciones={publicaciones} onEditarPublicacion={abrirFormularioEditar} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
