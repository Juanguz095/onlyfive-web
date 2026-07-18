import { useEffect, useMemo, useState } from 'react'
import Navbar from '../componentes/inicio/Navbar'
import Footer from '../componentes/inicio/Footer'
import ListaArticulos from '../componentes/articulos/ListaArticulos'
import estilos from './PaginaArticulos.module.css'

const normalizarArticulo = (articulo) => ({
  id: articulo.id,
  titulo: articulo.attributes?.titulo || 'Sin título',
  resumen: articulo.attributes?.resumen || 'Sin resumen',
  imagen: articulo.attributes?.imagen || '',
  categoria: articulo.attributes?.categoria || 'General',
  estado: articulo.attributes?.estado || 'borrador',
  fecha_publicacion: articulo.attributes?.fecha_publicacion || '',
  autor: articulo.attributes?.autor?.data?.attributes?.username || articulo.attributes?.autor?.data?.attributes?.email || 'Autor',
})

export default function PaginaArticulos() {
  const [articulos, setArticulos] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODAS')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const respuesta = await fetch('http://localhost:1337/api/articulos?filters[estado][$eq]=publicado&populate=autor&sort=fecha_publicacion:desc')
        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los artículos')
        }

        setArticulos((datos.data || []).map(normalizarArticulo))
      } catch {
        setError('Error al cargar artículos')
      } finally {
        setCargando(false)
      }
    }

    cargarArticulos()
  }, [])

  const categorias = useMemo(() => {
    const listado = Array.from(new Set(articulos.map((articulo) => articulo.categoria).filter(Boolean)))
    return ['TODAS', ...listado]
  }, [articulos])

  const articulosFiltrados = useMemo(() => (
    articulos.filter((articulo) => (
      categoriaSeleccionada === 'TODAS' || articulo.categoria === categoriaSeleccionada
    ))
  ), [articulos, categoriaSeleccionada])

  return (
    <div className={estilos.pagina}>
      <Navbar />
      <section className={estilos.seccion}>
        <header className={estilos.encabezado}>
          <h2 className={estilos.titulo}>ARTÍCULOS</h2>
        </header>

        <div className={estilos.cuerpo}>
          <aside className={estilos.sidebar}>
            <p className={estilos.subtitulo}>
              Explora publicaciones académicas, técnicas y experiencias del programa de cocina.
            </p>
            <div className={estilos.separador} />
            <label className={estilos.labelFiltro} htmlFor="categoria-articulo">CATEGORÍA</label>
            <select
              id="categoria-articulo"
              className={estilos.selectFiltro}
              value={categoriaSeleccionada}
              onChange={(evento) => setCategoriaSeleccionada(evento.target.value)}
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </aside>

          <main className={estilos.contenido}>
            {cargando && <p className={estilos.estado}>Cargando...</p>}
            {!cargando && error && <p className={estilos.estado}>{error}</p>}
            {!cargando && !error && articulosFiltrados.length === 0 && (
              <p className={estilos.estado}>No hay artículos para la categoría seleccionada.</p>
            )}
            {!cargando && !error && articulosFiltrados.length > 0 && (
              <ListaArticulos articulos={articulosFiltrados} />
            )}
          </main>
        </div>
      </section>
      <Footer />
    </div>
  )
}
