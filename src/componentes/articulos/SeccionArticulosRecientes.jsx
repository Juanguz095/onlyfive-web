import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListaArticulos from './ListaArticulos'
import estilos from './SeccionArticulosRecientes.module.css'

const normalizarArticulo = (articulo) => ({
  id: articulo.id,
  titulo: articulo.attributes?.titulo || 'Sin título',
  resumen: articulo.attributes?.resumen || 'Sin resumen',
  imagen: articulo.attributes?.imagen || '',
  categoria: articulo.attributes?.categoria || 'General',
  fecha_publicacion: articulo.attributes?.fecha_publicacion || '',
  autor: articulo.attributes?.autor?.data?.attributes?.username || articulo.attributes?.autor?.data?.attributes?.email || 'Autor',
})

export default function SeccionArticulosRecientes() {
  const [articulos, setArticulos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const respuesta = await fetch('http://localhost:1337/api/articulos?filters[estado][$eq]=publicado&populate=autor&sort=fecha_publicacion:desc&pagination[limit]=3')
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los artículos recientes')
        }

        setArticulos((datos.data || []).map(normalizarArticulo))
      } catch {
        setError('Error al cargar artículos recientes')
      } finally {
        setCargando(false)
      }
    }

    cargarArticulos()
  }, [])

  return (
    <section className={estilos.seccion}>
      <div className={estilos.encabezado}>
        <h2 className={estilos.titulo}>ARTÍCULOS RECIENTES</h2>
      </div>
      <div className={estilos.cuerpo}>
        {cargando && <p className={estilos.estado}>Cargando...</p>}
        {!cargando && error && <p className={estilos.estado}>{error}</p>}
        {!cargando && !error && articulos.length === 0 && (
          <p className={estilos.estado}>No hay artículos disponibles.</p>
        )}
        {!cargando && !error && articulos.length > 0 && <ListaArticulos articulos={articulos} />}
      </div>
      <div className={estilos.pie}>
        <Link className={estilos.linkVerMas} to="/articulos">
          Ver todos los artículos →
        </Link>
      </div>
    </section>
  )
}
