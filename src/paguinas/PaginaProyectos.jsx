import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../componentes/inicio/Navbar'
import Footer from '../componentes/inicio/Footer'
import estilos from './PaginaProyectos.module.css'

const ciclosDisponibles = ['TODOS', 'CICLO I', 'CICLO II', 'CICLO III', 'CICLO IV', 'CICLO V', 'CICLO VI']
const tiposDisponibles = ['TODOS', 'PROYECTOS', 'TALLERES', 'EVENTOS']
const clasesFondo = ['fondoAzul', 'fondoNaranja', 'fondoVerde', 'fondoRojo']

const obtenerDescripcion = (descripcion) => {
  if (!descripcion) return 'Publicación del portafolio académico del estudiante.'
  if (typeof descripcion === 'string') return descripcion
  return 'Publicación del portafolio académico del estudiante.'
}

const obtenerEstudiante = (autor) => (
  autor?.data?.attributes?.username || autor?.data?.attributes?.email || 'Estudiante'
)

const normalizarProyecto = (publicacion, indice) => {
  const atributos = publicacion.attributes || {}
  const fecha = atributos.fecha_publicacion ? new Date(atributos.fecha_publicacion) : null

  return {
    id: publicacion.id,
    ciclo: atributos.ciclo || 'CICLO I',
    tipo: atributos.tipo || 'PROYECTOS',
    tipoBadge: atributos.tipo === 'TALLERES' ? 'Trabajo práctico' : 'Proyecto final',
    estadoBadge: atributos.estado === 'publicado' ? 'Publicado' : atributos.estado,
    titulo: atributos.titulo || 'Sin título',
    descripcion: obtenerDescripcion(atributos.descripcion),
    taller: atributos.taller || atributos.categoria || 'Sin taller',
    docente: atributos.docente || 'Docente no asignado',
    estudiante: obtenerEstudiante(atributos.autor),
    anio: fecha ? String(fecha.getFullYear()) : 'Sin fecha',
    claseFondo: clasesFondo[indice % clasesFondo.length],
  }
}

export default function PaginaProyectos() {
  const [cicloSeleccionado, setCicloSeleccionado] = useState('TODOS')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('TODOS')
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const respuesta = await fetch('http://localhost:1337/api/publicacions?filters[estado][$eq]=publicado&populate=autor&sort=fecha_publicacion:desc')
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los proyectos')
        }

        setProyectos((datos.data || []).map(normalizarProyecto))
      } catch {
        setError('Error al cargar proyectos')
      } finally {
        setCargando(false)
      }
    }

    cargarProyectos()
  }, [])

  const proyectosFiltrados = proyectos.filter((proyecto) => {
    const coincideCiclo = cicloSeleccionado === 'TODOS' || proyecto.ciclo === cicloSeleccionado
    const coincideTipo = tipoSeleccionado === 'TODOS' || proyecto.tipo === tipoSeleccionado
    return coincideCiclo && coincideTipo
  })

  return (
    <div className={estilos.pagina}>
      <Navbar />
      <section className={estilos.seccion}>
        <div className={estilos.encabezado}>
          <h2 className={estilos.titulo}>PROYECTOS</h2>
        </div>

        <div className={estilos.cuerpo}>
          <aside className={estilos.filtros}>
            <p className={estilos.subtituloFiltro}>
              PROYECTOS INTEGRADORES DE CADA CICLO FORMATIVO.
            </p>

            <div className={estilos.separador} />

            <div className={estilos.grupoFiltro}>
              <span className={estilos.labelFiltro}>CICLOS</span>
              <select
                className={estilos.selectFiltro}
                value={cicloSeleccionado}
                onChange={(evento) => setCicloSeleccionado(evento.target.value)}
              >
                {ciclosDisponibles.map((ciclo) => (
                  <option key={ciclo} value={ciclo}>{ciclo}</option>
                ))}
              </select>
            </div>

            <div className={estilos.separador} />

            <div className={estilos.grupoFiltro}>
              <span className={estilos.labelFiltro}>TIPO</span>
              <select
                className={estilos.selectFiltro}
                value={tipoSeleccionado}
                onChange={(evento) => setTipoSeleccionado(evento.target.value)}
              >
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </aside>

          <div className={estilos.gridProyectos}>
            {cargando && <div className={estilos.sinResultados}>Cargando...</div>}
            {!cargando && error && <div className={estilos.sinResultados}>{error}</div>}
            {!cargando && !error && proyectosFiltrados.length === 0 && (
              <div className={estilos.sinResultados}>No hay proyectos para los filtros seleccionados.</div>
            )}
            {!cargando && !error && proyectosFiltrados.map((proyecto) => (
              <div key={proyecto.id} className={estilos.tarjeta}>
                <div className={`${estilos.tarjetaImagen} ${estilos[proyecto.claseFondo]}`}>
                  <div className={estilos.badgeCiclo}>{proyecto.ciclo}</div>
                </div>
                <div className={estilos.tarjetaCuerpo}>
                  <div className={estilos.badgesRow}>
                    <span className={estilos.badgeTipo}>{proyecto.tipoBadge}</span>
                    <span className={estilos.badgeEstado}>{proyecto.estadoBadge}</span>
                  </div>
                  <h3 className={estilos.tarjetaTitulo}>{proyecto.titulo}</h3>
                  <p className={estilos.tarjetaDesc}>{proyecto.descripcion}</p>
                  <div className={estilos.tarjetaMeta}>
                    <div className={estilos.metaFila}><span className={estilos.metaLabel}>Taller</span><span className={estilos.metaValor}>{proyecto.taller}</span></div>
                    <div className={estilos.metaFila}><span className={estilos.metaLabel}>Docente</span><span className={estilos.metaValor}>{proyecto.docente}</span></div>
                    <div className={estilos.metaFila}><span className={estilos.metaLabel}>Estudiante</span><span className={`${estilos.metaValor} ${estilos.metaLink}`}>{proyecto.estudiante}</span></div>
                    <div className={estilos.metaFila}><span className={estilos.metaLabel}>Año</span><span className={estilos.metaValor}>{proyecto.anio}</span></div>
                  </div>
                  <Link className={estilos.btnVerProyecto} to={`/publicacion/${proyecto.id}`}>Ver proyecto</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
