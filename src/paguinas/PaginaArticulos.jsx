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
  const [busqueda, setBusqueda] = useState('')
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

  const articulosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    return articulos.filter((articulo) => {
      const coincideCategoria = categoriaSeleccionada === 'TODAS' || articulo.categoria === categoriaSeleccionada
      if (!coincideCategoria) return false

      if (!texto) return true
      const enTitulo = articulo.titulo.toLowerCase().includes(texto)
      const enResumen = (articulo.resumen || '').toLowerCase().includes(texto)
      const enAutor = (articulo.autor || '').toLowerCase().includes(texto)
      return enTitulo || enResumen || enAutor
    })
  }, [articulos, categoriaSeleccionada, busqueda])

  return (
    <div className={estilos.pagina}>
      <Navbar />
      <main className={estilos.main}>
        <header className={estilos.encabezado}>
          <h1 className={estilos.titulo}>Artículos</h1>
          <p className={estilos.subtitulo}>
            Publicaciones del programa: técnicas, experiencias y aprendizaje aplicado.
          </p>

          <div className={estilos.barra}>
            <input
              className={estilos.buscador}
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por título, autor o resumen"
            />
          </div>

          <div className={estilos.chips}>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={`${estilos.chip} ${categoriaSeleccionada === categoria ? estilos.chipActivo : ''}`}
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </header>

        <section className={estilos.contenido}>
          {cargando && <div className={estilos.estado}>Cargando artículos...</div>}
          {!cargando && error && <div className={estilos.estado}>{error}</div>}
          {!cargando && !error && articulosFiltrados.length === 0 && (
            <div className={estilos.estado}>No hay artículos para lo que estás buscando.</div>
          )}
          {!cargando && !error && articulosFiltrados.length > 0 && (
            <ListaArticulos articulos={articulosFiltrados} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
