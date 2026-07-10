import { useEffect, useState } from 'react'
import estilos from './SeccionActividades.module.css'

const ciclosDisponibles = ['TODOS', 'CICLO I', 'CICLO II', 'CICLO III', 'CICLO IV']
const tiposDisponibles = ['TODOS', 'PROYECTOS', 'TALLERES', 'EVENTOS']
const coloresFondo = ['#f0f4ff', '#fff7ed', '#f0fdf4', '#fef2f2']

const obtenerDescripcion = (descripcion) => {
  if (!descripcion) return 'Publicacion del portafolio academico del estudiante.'
  if (typeof descripcion === 'string') return descripcion
  return 'Publicacion del portafolio academico del estudiante.'
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
    tipoBadge: atributos.tipo === 'TALLERES' ? 'Trabajo practico' : 'Proyecto final',
    estadoBadge: atributos.estado === 'publicado' ? 'Publicado' : atributos.estado,
    titulo: atributos.titulo || 'Sin titulo',
    descripcion: obtenerDescripcion(atributos.descripcion),
    taller: atributos.taller || atributos.categoria || 'Sin taller',
    docente: atributos.docente || 'Docente no asignado',
    estudiante: obtenerEstudiante(atributos.autor),
    anio: fecha ? String(fecha.getFullYear()) : 'Sin fecha',
    colorFondo: coloresFondo[indice % coloresFondo.length],
  }
}

export default function SeccionActividades() {
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
          throw new Error('No se pudieron cargar las actividades')
        }

        setProyectos((datos.data || []).map(normalizarProyecto))
      } catch {
        setError('Error al cargar actividades')
      } finally {
        setCargando(false)
      }
    }

    cargarProyectos()
  }, [])

  const proyectosFiltrados = proyectos.filter((p) => {
    const coincideCiclo = cicloSeleccionado === 'TODOS' || p.ciclo === cicloSeleccionado
    const coincideTipo = tipoSeleccionado === 'TODOS' || p.tipo === tipoSeleccionado
    return coincideCiclo && coincideTipo
  })

  return (
    <section className={estilos.seccion}>
      <div className={estilos.encabezado}>
        <h2 className={estilos.titulo}>ACTIVIDADES DE ESTUDIANTES</h2>
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
              onChange={(e) => setCicloSeleccionado(e.target.value)}
            >
              {ciclosDisponibles.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={estilos.separador} />

          <div className={estilos.grupoFiltro}>
            <span className={estilos.labelFiltro}>TIPO</span>
            <select
              className={estilos.selectFiltro}
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
            >
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className={estilos.gridProyectos}>
          {cargando && <div className={estilos.sinResultados}>Cargando...</div>}
          {error && <div className={estilos.sinResultados}>{error}</div>}
          {!cargando && !error && proyectosFiltrados.length === 0 && (
            <div className={estilos.sinResultados}>
              No hay actividades para los filtros seleccionados.
            </div>
          )}
          {!cargando && !error && proyectosFiltrados.map((p) => (
            <div key={p.id} className={estilos.tarjeta}>
              <div className={estilos.tarjetaImagen} style={{ background: p.colorFondo }}>
                <div className={estilos.badgeCiclo}>{p.ciclo}</div>
              </div>
              <div className={estilos.tarjetaCuerpo}>
                <div className={estilos.badgesRow}>
                  <span className={estilos.badgeTipo}>{p.tipoBadge}</span>
                  <span className={estilos.badgeEstado}>{p.estadoBadge}</span>
                </div>
                <h3 className={estilos.tarjetaTitulo}>{p.titulo}</h3>
                <p className={estilos.tarjetaDesc}>{p.descripcion}</p>
                <div className={estilos.tarjetaMeta}>
                  <div className={estilos.metaFila}><span className={estilos.metaLabel}>Taller</span><span className={estilos.metaValor}>{p.taller}</span></div>
                  <div className={estilos.metaFila}><span className={estilos.metaLabel}>Docente</span><span className={estilos.metaValor}>{p.docente}</span></div>
                  <div className={estilos.metaFila}><span className={estilos.metaLabel}>Estudiante</span><span className={`${estilos.metaValor} ${estilos.metaLink}`}>{p.estudiante}</span></div>
                  <div className={estilos.metaFila}><span className={estilos.metaLabel}>Anio</span><span className={estilos.metaValor}>{p.anio}</span></div>
                </div>
                <a className={estilos.btnVerProyecto} href={`/login?publicacion=${p.id}`}>Ver proyecto</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
