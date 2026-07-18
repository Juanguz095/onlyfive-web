import estilos from './SeccionInformacion.module.css'

const testimonios = [
  {
    cita: 'Gracias al programa fortalecí mis técnicas de cocina y presenté proyectos reales con enfoque profesional.',
    nombre: 'María García',
    rol: 'Estudiante de Ciclo IV',
  },
  {
    cita: 'Los talleres prácticos me ayudaron a ordenar mis procesos y mejorar la calidad de cada preparación.',
    nombre: 'Luis Mendoza',
    rol: 'Estudiante de Ciclo V',
  },
  {
    cita: 'El portafolio me permitió mostrar mis avances y postular con evidencia concreta de mis competencias.',
    nombre: 'Andrea Torres',
    rol: 'Egresada del programa',
  },
]

export default function SeccionInformacion() {
  return (
    <section>
      <div className={estilos.bloque}>
        <div className={estilos.encabezadoBloque}>
          <h2 className={estilos.titulo}>SOBRE EL PROGRAMA</h2>
        </div>
        <div className={estilos.gridSobrePrograma}>
          <img
            className={estilos.imagenPrograma}
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
            alt="Estudiantes en práctica de cocina"
          />
          <div className={estilos.contenidoPrograma}>
            <p className={estilos.parrafoPrograma}>
              El Programa de Estudios de Cocina del I.E.S.P. Simón Bolívar forma profesionales con enfoque técnico,
              creativo y humano. A través de talleres prácticos y proyectos integradores, los estudiantes desarrollan
              competencias para desempeñarse en cocinas profesionales, emprendimientos y gestión gastronómica.
            </p>
            <button className={estilos.botonOutline}>CONOCE MÁS</button>
          </div>
        </div>
      </div>

      <div className={estilos.bloque}>
        <div className={estilos.encabezadoBloque}>
          <h2 className={estilos.titulo}>TESTIMONIOS</h2>
        </div>
        <div className={estilos.gridTestimonios}>
          {testimonios.map((testimonio) => (
            <article key={testimonio.nombre} className={estilos.tarjetaTestimonio}>
              <div className={estilos.comillas}>“</div>
              <p className={estilos.cita}>{testimonio.cita}</p>
              <div className={estilos.footerTestimonio}>
                <div className={estilos.avatarTestimonio}>
                  {testimonio.nombre.split(' ').map((parte) => parte[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className={estilos.nombreTestimonio}>{testimonio.nombre}</p>
                  <p className={estilos.rolTestimonio}>{testimonio.rol}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
