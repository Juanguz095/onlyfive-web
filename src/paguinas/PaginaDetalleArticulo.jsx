import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../componentes/inicio/Navbar'
import Footer from '../componentes/inicio/Footer'
import SeccionReacciones from '../componentes/articulos/SeccionReacciones'
import SeccionComentarios from '../componentes/articulos/SeccionComentarios'
import estilos from './PaginaDetalleArticulo.module.css'

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-PE')
}

const normalizarArticulo = (articulo) => ({
  id: articulo.id,
  titulo: articulo.attributes?.titulo || 'Sin título',
  contenido: articulo.attributes?.contenido || '',
  resumen: articulo.attributes?.resumen || '',
  imagen: articulo.attributes?.imagen || '',
  categoria: articulo.attributes?.categoria || 'General',
  fecha_publicacion: articulo.attributes?.fecha_publicacion || '',
  autor: articulo.attributes?.autor?.data?.attributes?.username || articulo.attributes?.autor?.data?.attributes?.email || 'Autor',
})

export default function PaginaDetalleArticulo() {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarArticulo = async () => {
      const jwt = localStorage.getItem('jwt')
      const headers = jwt
        ? { Authorization: `Bearer ${jwt}` }
        : undefined

      try {
        const respuesta = await fetch(`http://localhost:1337/api/articulos/${id}?populate=autor`, { headers })
        const datos = await respuesta.json()

        if (!respuesta.ok || !datos?.data) {
          throw new Error(datos?.error?.message || 'No se pudo cargar el artículo')
        }

        setArticulo(normalizarArticulo(datos.data))
      } catch {
        setError('Error al cargar el artículo')
      } finally {
        setCargando(false)
      }
    }

    cargarArticulo()
  }, [id])

  return (
    <div className={estilos.pagina}>
      <Navbar />
      <main className={estilos.main}>
        <nav className={estilos.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span>→</span>
          <Link to="/articulos">Artículos</Link>
          <span>→</span>
          <span>{articulo?.titulo || 'Detalle'}</span>
        </nav>

        {cargando && <p className={estilos.estado}>Cargando artículo...</p>}
        {!cargando && error && <p className={estilos.estado}>{error}</p>}

        {!cargando && !error && articulo && (
          <article className={estilos.cardArticulo}>
            {articulo.imagen && (
              <img className={estilos.portada} src={articulo.imagen} alt={articulo.titulo} />
            )}
            <h1 className={estilos.titulo}>{articulo.titulo}</h1>
            <p className={estilos.meta}>
              <span className={estilos.badge}>{articulo.categoria}</span>
              <span>{formatearFecha(articulo.fecha_publicacion)}</span>
              <span>{articulo.autor}</span>
            </p>
            <div className={estilos.contenido}>
              {articulo.contenido || articulo.resumen || 'Sin contenido disponible.'}
            </div>

            <SeccionReacciones articuloId={articulo.id} />
            <SeccionComentarios articuloId={articulo.id} />
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
