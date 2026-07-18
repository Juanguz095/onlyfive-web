import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GripVertical, Eye, Copy, FileDown, Globe, Lock, Trash2, Plus } from 'lucide-react'
import HeaderDashboard from '../componentes/dashBoardEstudiante/HeaderDashboard'
import SidebarEstudiante from '../componentes/dashBoardEstudiante/SidebarEstudiante'
import estilos from './PaginaPortafolio.module.css'

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

const ordenarPorIds = (publicaciones, ordenGuardado) => {
  if (!Array.isArray(ordenGuardado) || ordenGuardado.length === 0) return publicaciones

  const ids = ordenGuardado.map((valor) => Number(valor)).filter((valor) => !Number.isNaN(valor))
  const mapa = new Map(publicaciones.map((publicacion) => [publicacion.id, publicacion]))

  const ordenadas = ids
    .map((idPublicacion) => mapa.get(idPublicacion))
    .filter(Boolean)

  const restantes = publicaciones.filter((publicacion) => !ids.includes(publicacion.id))
  return [...ordenadas, ...restantes]
}

const construirTituloPortafolio = (usuario) => {
  const nombre = usuario?.username || usuario?.email || 'Estudiante'
  return `Portafolio de ${nombre}`
}

const extraerPrimerPortafolio = (respuesta) => {
  if (!respuesta?.data) return null
  if (Array.isArray(respuesta.data)) return respuesta.data[0] || null
  return respuesta.data
}

const copiarConFallback = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = texto
      area.setAttribute('readonly', 'true')
      area.style.position = 'absolute'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const resultado = document.execCommand('copy')
      document.body.removeChild(area)
      return Boolean(resultado)
    } catch {
      return false
    }
  }
}

export default function PaginaPortafolio() {
  const navegar = useNavigate()

  const [portafolio, setPortafolio] = useState(null)
  const [publicaciones, setPublicaciones] = useState([])
  const [publicacionesDisponibles, setPublicacionesDisponibles] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [enlacePublico, setEnlacePublico] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const dragDesdeRef = useRef(null)
  const dragHaciaRef = useRef(null)

  const mostrarMensaje = (texto) => {
    setMensaje(texto)
    window.setTimeout(() => setMensaje(''), 2500)
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

  const crearPortafolioSiNoExiste = async (jwt, datosUsuario) => {
    const respuesta = await fetch('http://localhost:1337/api/portafolios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          titulo: construirTituloPortafolio(datosUsuario),
          descripcion: 'Portafolio personal del estudiante.',
          es_publico: false,
          publicaciones: [],
          orden_publicaciones: [],
        },
      }),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok || !datos?.data) {
      const detalle = datos?.error?.message || datos?.message || 'No se pudo crear automáticamente el portafolio'
      throw new Error(detalle)
    }

    return datos.data
  }

  const cargarPortafolio = async () => {
    const jwt = localStorage.getItem('jwt')

    if (!jwt) {
      setError('Debes iniciar sesión para ver tu portafolio')
      setCargando(false)
      navegar('/login')
      return
    }

    try {
      const respuestaUsuario = await fetch('http://localhost:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      const datosUsuario = await respuestaUsuario.json()

      if (!respuestaUsuario.ok || !datosUsuario.id) {
        throw new Error('No se pudo obtener el usuario')
      }

      setUsuario(datosUsuario)

      const respuestaPublicacionesMias = await fetch('http://localhost:1337/api/publicacions/mias', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      const datosPublicacionesMias = await respuestaPublicacionesMias.json()

      if (!respuestaPublicacionesMias.ok) {
        const detalle = datosPublicacionesMias?.error?.message || datosPublicacionesMias?.message || 'No se pudieron cargar tus publicaciones'
        throw new Error(detalle)
      }

      let portafolioActual = await pedirPortafolioMio(jwt)

      if (!portafolioActual) {
        portafolioActual = await pedirPortafolioPorFiltro(jwt, datosUsuario.id)
      }

      if (!portafolioActual) {
        portafolioActual = await crearPortafolioSiNoExiste(jwt, datosUsuario)
      }

      if (!portafolioActual?.id) {
        throw new Error('No se pudo obtener el portafolio del estudiante')
      }

      setPortafolio(portafolioActual)

      const publicacionesCrudas = portafolioActual.attributes?.publicaciones?.data || []
      const publicacionesNormalizadas = publicacionesCrudas.map(normalizarPublicacion)
      const ordenGuardado = portafolioActual.attributes?.orden_publicaciones || []
      const publicacionesOrdenadas = ordenarPorIds(publicacionesNormalizadas, ordenGuardado)

      setPublicaciones(publicacionesOrdenadas)

      const idsEnPortafolio = new Set(publicacionesOrdenadas.map((publicacion) => publicacion.id))
      const publicacionesMias = (datosPublicacionesMias.data || []).map(normalizarPublicacion)
      setPublicacionesDisponibles(publicacionesMias.filter((publicacion) => !idsEnPortafolio.has(publicacion.id)))

      const slug = portafolioActual.attributes?.slug_compartible
      setEnlacePublico(slug ? `${window.location.origin}/portafolio/publico/${slug}` : '')
      setError('')
    } catch (errorCarga) {
      setError(errorCarga.message || 'Error al cargar portafolio')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPortafolio()
  }, [])

  const guardarOrdenEnBackend = async (publicacionesOrdenadas) => {
    const jwt = localStorage.getItem('jwt')
    if (!jwt) return

    const ids = publicacionesOrdenadas.map((publicacion) => publicacion.id)

    try {
      const respuesta = await fetch('http://localhost:1337/api/portafolios/orden', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ publicaciones: ids }),
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo guardar el nuevo orden')
      }
    } catch {
      await actualizarRelacionPublicaciones(ids)
    }

    setPortafolio((previo) => {
      if (!previo) return previo

      return {
        ...previo,
        attributes: {
          ...previo.attributes,
          orden_publicaciones: ids,
        },
      }
    })
  }

  const actualizarRelacionPublicaciones = async (idsPublicaciones) => {
    const jwt = localStorage.getItem('jwt')

    if (!jwt || !portafolio?.id) {
      throw new Error('No hay sesión o portafolio activo')
    }

    const respuesta = await fetch(`http://localhost:1337/api/portafolios/${portafolio.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          publicaciones: idsPublicaciones,
          orden_publicaciones: idsPublicaciones,
        },
      }),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      const detalle = datos?.error?.message || datos?.message || 'No se pudo actualizar el portafolio'
      throw new Error(detalle)
    }

    setPortafolio((previo) => {
      if (!previo) return previo

      return {
        ...previo,
        attributes: {
          ...previo.attributes,
          orden_publicaciones: idsPublicaciones,
        },
      }
    })

    return datos?.data || null
  }

  const handleDragStart = (_evento, index) => {
    dragDesdeRef.current = index
  }

  const handleDragOver = (evento, index) => {
    evento.preventDefault()
    dragHaciaRef.current = index
  }

  const handleDrop = async (evento, index) => {
    evento.preventDefault()

    const desde = dragDesdeRef.current
    const hacia = typeof dragHaciaRef.current === 'number' ? dragHaciaRef.current : index

    if (desde === null || desde === undefined || hacia === null || hacia === undefined || desde === hacia) {
      return
    }

    const lista = [...publicaciones]
    const [itemMovido] = lista.splice(desde, 1)
    lista.splice(hacia, 0, itemMovido)

    setPublicaciones(lista)

    try {
      await guardarOrdenEnBackend(lista)
      mostrarMensaje('Orden actualizado')
    } catch {
      mostrarMensaje('No se pudo actualizar el orden')
      await cargarPortafolio()
    }
  }

  const handleDragEnd = () => {
    dragDesdeRef.current = null
    dragHaciaRef.current = null
  }

  const handleTogglePublico = async (evento) => {
    const esPublico = evento.target.checked
    const jwt = localStorage.getItem('jwt')

    if (!jwt) {
      navegar('/login')
      return
    }

    try {
      const respuesta = await fetch('http://localhost:1337/api/portafolios/toggle-publico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ es_publico: esPublico }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos?.data) {
        throw new Error('No se pudo cambiar la visibilidad del portafolio')
      }

      setPortafolio((previo) => {
        if (!previo) return previo

        return {
          ...previo,
          attributes: {
            ...previo.attributes,
            es_publico: datos.data?.attributes?.es_publico,
            slug_compartible: datos.data?.attributes?.slug_compartible,
          },
        }
      })

      const slug = datos.data?.attributes?.slug_compartible
      setEnlacePublico(slug ? `${window.location.origin}/portafolio/publico/${slug}` : '')

      mostrarMensaje(esPublico ? 'Portafolio público activado' : 'Portafolio privado activado')
    } catch {
      mostrarMensaje('No se pudo actualizar la visibilidad')
      await cargarPortafolio()
    }
  }

  const quitarPublicacion = async (publicacionId) => {
    if (!portafolio?.id) return

    const publicacionQuitada = publicaciones.find((publicacion) => publicacion.id === publicacionId)
    const publicacionesRestantes = publicaciones.filter((publicacion) => publicacion.id !== publicacionId)
    const idsRestantes = publicacionesRestantes.map((publicacion) => publicacion.id)

    setPublicaciones(publicacionesRestantes)

    try {
      await actualizarRelacionPublicaciones(idsRestantes)

      if (publicacionQuitada) {
        setPublicacionesDisponibles((previo) => [publicacionQuitada, ...previo.filter((pub) => pub.id !== publicacionQuitada.id)])
      }

      mostrarMensaje('Publicación quitada del portafolio')
    } catch (errorPeticion) {
      mostrarMensaje(errorPeticion?.message || 'No se pudo quitar la publicación')
      await cargarPortafolio()
    }
  }

  const agregarPublicacion = async (publicacionSeleccionada) => {
    if (!portafolio?.id || !publicacionSeleccionada?.id) return

    const yaExiste = publicaciones.some((publicacion) => publicacion.id === publicacionSeleccionada.id)
    if (yaExiste) return

    const nuevasPublicaciones = [...publicaciones, publicacionSeleccionada]
    const idsNuevos = nuevasPublicaciones.map((publicacion) => publicacion.id)

    setPublicaciones(nuevasPublicaciones)
    setPublicacionesDisponibles((previo) => previo.filter((publicacion) => publicacion.id !== publicacionSeleccionada.id))

    try {
      await actualizarRelacionPublicaciones(idsNuevos)
      mostrarMensaje('Publicación agregada al portafolio')
    } catch (errorPeticion) {
      mostrarMensaje(errorPeticion?.message || 'No se pudo agregar la publicación')
      await cargarPortafolio()
    }
  }

  const verVistaPublica = () => {
    if (!enlacePublico) {
      mostrarMensaje('Primero activa el portafolio público')
      return
    }

    window.open(enlacePublico, '_blank', 'noopener,noreferrer')
  }

  const copiarEnlace = async () => {
    if (!enlacePublico) {
      mostrarMensaje('Primero activa el portafolio público')
      return
    }

    const copiado = await copiarConFallback(enlacePublico)
    mostrarMensaje(copiado ? 'Enlace copiado' : 'No se pudo copiar el enlace')
  }

  const exportarPdf = () => {
    if (!enlacePublico) {
      mostrarMensaje('Primero activa el portafolio público')
      return
    }

    window.open(`${enlacePublico}?print=1`, '_blank', 'noopener,noreferrer')
  }

  const nombreUsuario = obtenerNombreUsuario(usuario)
  const esPublico = Boolean(portafolio?.attributes?.es_publico)

  return (
    <div className={estilos.pagina}>
      <HeaderDashboard migaActiva="Portafolio" nombreUsuario={nombreUsuario} iniciales={obtenerIniciales(nombreUsuario)} />
      <div className={estilos.cuerpo}>
        <SidebarEstudiante vistaActiva="portafolio" />
        <main className={estilos.main}>
          <div className={estilos.encabezadoPortafolio}>
            <div>
              <span className={estilos.subtituloPortafolio}>MI PORTAFOLIO</span>
              <h1 className={estilos.tituloPortafolio}>{portafolio?.attributes?.titulo || 'Portafolio'}</h1>
            </div>
            <div className={estilos.accionesPortafolio}>
              <button className={estilos.btnAccionPrimario} onClick={verVistaPublica}>
                <Eye size={14} />
                Ver vista pública
              </button>
              <button className={estilos.btnAccionSecundario} onClick={copiarEnlace}>
                <Copy size={14} />
                Copiar enlace
              </button>
              <button className={estilos.btnAccionSecundario} onClick={exportarPdf}>
                <FileDown size={14} />
                Exportar PDF
              </button>
            </div>
          </div>

          {cargando && <p className={estilos.estado}>Cargando portafolio...</p>}
          {!cargando && error && <p className={estilos.estado}>{error}</p>}

          {!cargando && !error && (
            <>
              <div className={estilos.descripcionCard}>
                <span className={estilos.descripcionLabel}>DESCRIPCIÓN</span>
                <p className={estilos.descripcionTexto}>
                  {portafolio?.attributes?.descripcion || 'Aún no agregaste una descripción para este portafolio.'}
                </p>
              </div>

              <div className={estilos.toggleContainer}>
                <label className={estilos.toggleSwitch}>
                  <input
                    type="checkbox"
                    className={estilos.toggleInput}
                    checked={esPublico}
                    onChange={handleTogglePublico}
                  />
                  <span className={estilos.toggleTrack} />
                </label>
                <span className={estilos.toggleLabel}>
                  {esPublico ? (
                    <>
                      <Globe size={13} /> Portafolio público — cualquier persona con el enlace puede verlo
                    </>
                  ) : (
                    <>
                      <Lock size={13} /> Portafolio privado — solo tú puedes verlo
                    </>
                  )}
                </span>
              </div>

              <div className={estilos.gridPublicaciones}>
                {publicaciones.map((pub, index) => (
                  <div
                    key={pub.id}
                    className={estilos.filaPublicacion}
                    draggable
                    onDragStart={(evento) => handleDragStart(evento, index)}
                    onDragOver={(evento) => handleDragOver(evento, index)}
                    onDrop={(evento) => handleDrop(evento, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className={estilos.miniatura}>
                      <GripVertical size={16} className={estilos.dragHandle} />
                    </div>
                    <div className={estilos.infoPublicacion}>
                      <span className={estilos.tituloPub}>{pub.titulo}</span>
                      <span className={estilos.metaPub}>
                        {pub.estado} · {pub.categoria} ·{' '}
                        {pub.fecha_publicacion
                          ? new Date(pub.fecha_publicacion).toLocaleDateString('es-PE')
                          : 'Sin fecha'}
                      </span>
                    </div>
                    <div className={estilos.accionesFila}>
                      <button
                        className={estilos.btnEliminar}
                        onClick={() => quitarPublicacion(pub.id)}
                        title="Quitar del portafolio"
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {publicaciones.length === 0 && (
                <div className={estilos.emptyState}>
                  No hay publicaciones en tu portafolio. Crea publicaciones desde tu dashboard y agrégalas aquí.
                </div>
              )}

              <section className={estilos.bloqueDisponibles}>
                <div className={estilos.bloqueDisponiblesCabecera}>
                  <h2 className={estilos.bloqueDisponiblesTitulo}>Publicaciones disponibles para agregar</h2>
                  <span className={estilos.bloqueDisponiblesCantidad}>{publicacionesDisponibles.length}</span>
                </div>

                {publicacionesDisponibles.length === 0 && (
                  <p className={estilos.bloqueDisponiblesVacio}>Todas tus publicaciones ya están en el portafolio.</p>
                )}

                {publicacionesDisponibles.length > 0 && (
                  <div className={estilos.listaDisponibles}>
                    {publicacionesDisponibles.map((pub) => (
                      <div key={pub.id} className={estilos.filaDisponible}>
                        <div className={estilos.infoPublicacion}>
                          <span className={estilos.tituloPub}>{pub.titulo}</span>
                          <span className={estilos.metaPub}>
                            {pub.estado} · {pub.categoria} ·{' '}
                            {pub.fecha_publicacion
                              ? new Date(pub.fecha_publicacion).toLocaleDateString('es-PE')
                              : 'Sin fecha'}
                          </span>
                        </div>
                        <button className={estilos.btnAgregar} onClick={() => agregarPublicacion(pub)}>
                          <Plus size={14} />
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {mensaje && <div className={estilos.mensajeToast}>{mensaje}</div>}
        </main>
      </div>
    </div>
  )
}
