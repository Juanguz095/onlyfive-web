import estilos from './Hero.module.css'

export default function Hero() {
  return (
    <section className={estilos.hero}>
      <div className={estilos.tituloBloque}>
        <h1 className={estilos.tituloPrincipal}>PROGRAMA DE ESTUDIOS DE COCINA</h1>
      </div>

      <div className={estilos.contenidoHero}>
        <div className={estilos.imagenContenedor}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
            alt="Estudiantes de cocina"
            className={estilos.imagenHero}
          />
        </div>

        <div className={estilos.textoHero}>
          <h2 className={estilos.slogan}>
            FORMAMOS TALENTO, CREAMOS EXPERIENCIAS
          </h2>
          <p className={estilos.descripcion}>
            Descubre el arte, la pasión y la creatividad de nuestros estudiantes y docentes en cada preparación.
          </p>
          <button className={estilos.btnConoce}>CONOCE MÁS</button>
        </div>
      </div>
    </section>
  )
}
