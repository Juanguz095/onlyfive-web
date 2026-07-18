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
  imagen: publicacion.attributes?.imagen || '',
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

const construirTituloPortafolio = (usuario) => {
  const nombre = usuario?.username || usuario?.email || 'Estudiante'
  return `Portafolio de ${nombre}`
}

const extraerPrimerPortafolio = (respuesta) => {
  if (!respuesta?.data) return null
  if (Array.isArray(respuesta.data)) return respuesta.data[0] || null
  return respuesta.data
}

export default function PaginaDashboardEstudiante() {
  const location = useLocation()
  const [publicaciones, setPublicaciones] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormularioNuevaPublicacion, setMostrarFormularioNuevaPublicacion] = useState(false)
  const [enlacePublicoPortafolio, setEnlacePublicoPortafolio] = useState('')
  const [publicacionEnEdicion, setPublicacionEnEdicion] = useState(null)
  const [portafolioId, setPortafolioId] = useState(null)
  const [publicacionesEnPortafolioIds, setPublicacionesEnPortafolioIds] = useState([])
  const [cargandoPortafolio, setCargandoPortafolio] = useState(false)
  const [mensajePortafolio, setMensajePortafolio] = useState('')

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    if (query.get('nueva') === '1') {
      setPublicacionEnEdicion(null)
      setMostrarFormularioNuevaPublicacion(true)
    }
  }, [location.search])

  const aplicarEstadoPortafolio = (portafolio) => {
    if (!portafolio?.id) {
      setPortafolioId(null)
      setPublicacionesEnPortafolioIds([])
      setEnlacePublicoPortafolio('')
      return
    }

    setPortafolioId(portafolio.id)

    const slugCompartible = portafolio?.attributes?.slug_compartible
    setEnlacePublicoPortafolio(slugCompartible ? `${window.location.origin}/portafolio/publico/${slugCompartible}` : '')

    const idsPortafolio = (portafolio?.attributes?.publicaciones?.data || [])
      .map((publicacion) => publicacion.id)
      .filter(Boolean)

    setPublicacionesEnPortafolioIds(idsPortafolio)
  }

  const pedirPortafolioMio = async (jwt) => {
    try {
      const respuesta = await fetch('http://localhost:1337/api/portafolios/mio?populate=publicaciones', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        return null
      }

      return extraerPrimerPortafolio(datos)
    } catch {
      return null
    }
  }

  const pedirPortafolioPorFiltro = async (jwt, usuarioId) => {
    try {
      const respuesta = await fetch(
        `http://localhost:1337/api/portafolios?filters[estudiante][id][$eq]=${usuarioId}&populate=publicaciones&sort=id:desc`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        return null
      }

      return extraerPrimerPortafolio(datos)
    } catch {
      return null
    }
  }

  const crearPortafolio = async (jwt, usuarioActual) => {
    const respuestaCrear = await fetch('http://localhost:1337/api/portafolios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          titulo: construirTituloPortafolio(usuarioActual),
          descripcion: 'Portafolio personal del estudiante.',
          es_publico: false,
          publicaciones: [],
          orden_publicaciones: [],
        },
      }),
    })

    const datosCrear = await respuestaCrear.json()

    if (!respuestaCrear.ok || !datosCrear?.data?.id) {
      const detalle = datosCrear?.error?.message || datosCrear?.message || 'No se pudo crear el portafolio'
      throw new Error(detalle)
    }

    return datosCrear.data
  }

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
        const usuarioAutenticado = await respuestaUsuario.json()

        if (!respuestaUsuario.ok || !usuarioAutenticado.id) {
          throw new Error('No se pudo obtener el usuario')
        }

        setUsuario(usuarioAutenticado)

        const respuestaPublicaciones = await fetch('http://localhost:1337/api/publicacions/mias', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })

        const datosPublicaciones = await respuestaPublicaciones.json()

        if (!respuestaPublicaciones.ok) {
          const detalle = datosPublicaciones?.error?.message || datosPublicaciones?.message || 'No se pudieron cargar las publicaciones'
          throw new Error(detalle)
        }

        setPublicaciones((datosPublicaciones.data || []).map(normalizarPublicacion))

        const portafolioMio = await pedirPortafolioMio(jwt)
        const portafolioFinal = portafolioMio || await pedirPortafolioPorFiltro(jwt, usuarioAutenticado.id)

        aplicarEstadoPortafolio(portafolioFinal)
      } catch (errorCarga) {
        setError(errorCarga?.message || 'Error al cargar publicaciones')
      } finally {
        setCargando(false)
      }
    }

    cargarPublicaciones()
  }, [])

  const mostrarMensajePortafolio = (texto) => {
    setMensajePortafolio(texto)
    window.setTimeout(() => setMensajePortafolio(''), 2500)
  }

  const asegurarPortafolio = async (jwt, usuarioActual) => {
    if (portafolioId) return portafolioId

    let portafolio = await pedirPortafolioMio(jwt)

    if (!portafolio && usuarioActual?.id) {
      portafolio = await pedirPortafolioPorFiltro(jwt, usuarioActual.id)
    }

    if (!portafolio) {
      portafolio = await crearPortafolio(jwt, usuarioActual)
    }

    aplicarEstadoPortafolio(portafolio)
    return portafolio.id
  }

  const manejarAgregarAlPortafolio = async (publicacion) => {
    const jwt = localStorage.getItem('jwt')
    if (!jwt || !usuario?.id || !publicacion?.id) return

    if (publicacionesEnPortafolioIds.includes(publicacion.id)) {
      mostrarMensajePortafolio('La publicación ya está en tu portafolio')
      return
    }

    setCargandoPortafolio(true)

    try {
      const idPortafolio = await asegurarPortafolio(jwt, usuario)
      const nuevosIds = [...publicacionesEnPortafolioIds, publicacion.id]

      const respuestaUpdate = await fetch(`http://localhost:1337/api/portafolios/${idPortafolio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            publicaciones: nuevosIds,
            orden_publicaciones: nuevosIds,
          },
        }),
      })

      const datosUpdate = await respuestaUpdate.json()

      if (!respuestaUpdate.ok) {
        const detalle = datosUpdate?.error?.message || datosUpdate?.message || 'No se pudo actualizar el portafolio'
        throw new Error(detalle)
      }

      setPublicacionesEnPortafolioIds(nuevosIds)
      mostrarMensajePortafolio('Publicación agregada al portafolio')
    } catch (errorPeticion) {
      mostrarMensajePortafolio(errorPeticion?.message || 'No se pudo agregar al portafolio')
    } finally {
      setCargandoPortafolio(false)
    }
  }

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
    <div className={estilos.pagina}>
      <HeaderDashboard migaActiva="Mi portafolio" nombreUsuario={nombreUsuario} iniciales={obtenerIniciales(nombreUsuario)} />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante vistaActiva="dashboard" onNuevaPublicacion={abrirFormularioCrear} />
        <main className={estilos.main}>
          <EncabezadoPortafolio
            titulo="Mi portafolio"
            labelPanel="Panel de estudiante"
            enlacePublicoPortafolio={enlacePublicoPortafolio}
          />

          {mensajePortafolio && <p className={estilos.mensajePortafolio}>{mensajePortafolio}</p>}

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
              <ListaPublicaciones
                publicaciones={publicaciones}
                onEditarPublicacion={abrirFormularioEditar}
                onAgregarAlPortafolio={manejarAgregarAlPortafolio}
                idsEnPortafolio={publicacionesEnPortafolioIds}
                bloqueandoPortafolio={cargandoPortafolio}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
