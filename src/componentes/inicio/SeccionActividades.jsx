import estilos from './SeccionActividades.module.css'

const proyectos = [
  {
    ciclo: 'Ciclo III',
    tipoBadge: 'Proyecto final',
    estadoBadge: 'Aprobado',
    titulo: 'Menú degustación de 5 tiempos — cocina novoandina',
    descripcion:
      'Proyecto integrador del taller de cocina creativa. Incluye 5 recetas, memoria escrita y presentación fotográfica del proceso.',
    taller: 'Cocina Creativa II',
    docente: 'Prof. Melvin Nolazco',
    estudiante: 'María García Quispe',
    anio: '2026',
    colorFondo: '#f0f4ff',
  },
  {
    ciclo: 'Ciclo V',
    tipoBadge: 'Proyecto final',
    estadoBadge: 'Aprobado',
    titulo: 'Repostería artesanal: técnicas de chocolate bean to bar',
    descripcion:
      'Investigación y práctica del proceso completo del cacao peruano hasta la tableta artesanal. Incluye recetario y análisis sensorial.',
    taller: 'Repostería Avanzada',
    docente: 'Prof. Melvin Nolazco',
    estudiante: 'Carlos Mendoza Ríos',
    anio: '2026',
    colorFondo: '#fff7ed',
  },
  {
    ciclo: 'Ciclo I',
    tipoBadge: 'Trabajo práctico',
    estadoBadge: 'Aprobado',
    titulo: 'Ensaladas templadas y técnicas de corte básico',
    descripcion:
      'Primer trabajo práctico del ciclo. Documentación fotográfica de técnicas de corte juliana, brunoise y chiffonade aplicadas.',
    taller: 'Cocina Básica I',
    docente: 'Prof. Melvin Nolazco',
    estudiante: 'Iker Gaitán Maldonado',
    anio: '2026',
    colorFondo: '#f0fdf4',
  },
]

const ciclosDisponibles = ['CICLO I', 'CICLO III', 'CICLO V']
const tiposDisponibles = ['PROYECTOS', 'TALLERES', 'EVENTOS']

export default function SeccionActividades() {
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
            <div className={estilos.listaBadges}>
              {ciclosDisponibles.map((c) => (
                <button key={c} className={`${estilos.badgeFiltro} ${c === 'CICLO I' ? estilos.badgeActivo : ''}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className={estilos.separador} />

          <div className={estilos.grupoFiltro}>
            <span className={estilos.labelFiltro}>TIPO</span>
            <div className={estilos.listaBadges}>
              {tiposDisponibles.map((t) => (
                <button key={t} className={`${estilos.badgeFiltro} ${t === 'PROYECTOS' ? estilos.badgeActivo : ''}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className={estilos.gridProyectos}>
          {proyectos.map((p, i) => (
            <div key={i} className={estilos.tarjeta}>
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
                  <div className={estilos.metaFila}><span className={estilos.metaLabel}>Año</span><span className={estilos.metaValor}>{p.anio}</span></div>
                </div>
                <button className={estilos.btnVerProyecto}>Ver proyecto</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
