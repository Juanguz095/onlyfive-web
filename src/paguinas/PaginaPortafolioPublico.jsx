import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import estilos from './PaginaPortafolioPublico.module.css'

const normalizarPublicacion = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.attributes?.titulo || '',
  estado: publicacion.attributes?.estado || 'borrador',
  categoria: publicacion.attributes?.categoria || 'Sin categoría',
  fecha_publicacion: publicacion.attributes?.fecha_publicacion || '',
  descripcion: publicacion.attributes?.descripcion || '',
})

const sanearHtmlBasico = (html) => String(html || '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  .replace(/\son\w+='[^']*'/gi, '')
  .replace(/javascript:/gi, '')
  .trim()

export default function PaginaPortafolioPublico() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [portafolio, setPortafolio] = useState(null)
  const [publicaciones, setPublicaciones] = useState([])

  useEffect(() => {
    const cargarPortafolioPublico = async () => {
      try {
        const respuesta = await fetch(`http://localhost:1337/api/portafolios/publico/${slug}`)
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(datos?.error?.message || 'No se pudo cargar el portafolio público')
        }

        const dataPortafolio = datos?.data
        const publicacionesCrudas = dataPortafolio?.attributes?.publicaciones?.data || []

        setPortafolio(dataPortafolio)
        setPublicaciones(publicacionesCrudas.map(normalizarPublicacion))
      } catch (errorPeticion) {
        setError(errorPeticion.message || 'No se pudo cargar el portafolio público')
      } finally {
        setCargando(false)
      }
    }

    cargarPortafolioPublico()
  }, [slug])

  useEffect(() => {
    if (cargando || !portafolio) return

    if (searchParams.get('print') === '1') {
      const timeout = window.setTimeout(() => window.print(), 450)
      return () => window.clearTimeout(timeout)
    }
  }, [cargando, portafolio, searchParams])

  const nombrePortafolio = useMemo(() => portafolio?.attributes?.titulo || 'Portafolio', [portafolio])

  return (
    <div className={estilos.pagina}>
      <div className={estilos.contenedor}>
        <header className={estilos.header}>
          <p className={estilos.badge}>PORTAFOLIO PÚBLICO</p>
          <h1 className={estilos.nombre}>{nombrePortafolio}</h1>
          {portafolio?.attributes?.descripcion && (
            <p className={estilos.descripcion}>{portafolio.attributes.descripcion}</p>
          )}
          <p className={estilos.meta}>Publicaciones visibles: {publicaciones.length}</p>
        </header>

        {cargando && <p className={estilos.estado}>Cargando portafolio...</p>}
        {!cargando && error && <p className={estilos.estado}>{error}</p>}

        {!cargando && !error && (
          <div className={estilos.grid}>
            {publicaciones.map((publicacion) => (
              <article key={publicacion.id} className={estilos.tarjeta}>
                <div className={estilos.tarjetaHeader}>
                  <h2 className={estilos.tarjetaTitulo}>{publicacion.titulo}</h2>
                  <span
                    className={`${estilos.badgeEstado} ${publicacion.estado === 'publicado' ? estilos.badgePublicado : estilos.badgeBorrador}`}
                  >
                    {publicacion.estado}
                  </span>
                </div>
                <div className={estilos.tarjetaBody}>
                  <div className={estilos.tarjetaMeta}>
                    <span>{publicacion.categoria}</span>
                    <span>
                      {publicacion.fecha_publicacion
                        ? new Date(publicacion.fecha_publicacion).toLocaleDateString('es-PE')
                        : 'Sin fecha'}
                    </span>
                  </div>
                  {publicacion.descripcion && (
                    <div
                      className={estilos.tarjetaDesc}
                      dangerouslySetInnerHTML={{ __html: sanearHtmlBasico(publicacion.descripcion) }}
                    />
                  )}
                  <Link className={estilos.verProyecto} to={`/publicacion/${publicacion.id}`}>Ver proyecto</Link>
                </div>
              </article>
            ))}

            {publicaciones.length === 0 && (
              <p className={estilos.empty}>Este portafolio no tiene publicaciones disponibles para vista pública.</p>
            )}
          </div>
        )}

        <div className={estilos.volver}>
          <Link to="/" className={estilos.volverLink}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
