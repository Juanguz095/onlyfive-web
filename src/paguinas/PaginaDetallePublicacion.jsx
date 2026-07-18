import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../componentes/inicio/Navbar'
import Footer from '../componentes/inicio/Footer'
import estilos from './estilos/PaginaDetallePublicacion.module.css'

const normalizarPublicacion = (dato) => {
  const atributos = dato?.attributes || {}

  return {
    id: dato?.id,
    titulo: atributos.titulo || 'Sin título',
    descripcion: atributos.descripcion || 'Sin descripción',
    imagen: atributos.imagen || '',
    estado: atributos.estado || 'borrador',
    categoria: atributos.categoria || 'Sin categoría',
    ciclo: atributos.ciclo || 'Sin ciclo',
    tipo: atributos.tipo || 'Sin tipo',
    taller: atributos.taller || 'Sin taller',
    docente: atributos.docente || 'Docente no asignado',
    fechaPublicacion: atributos.fecha_publicacion || '',
    autor: atributos.autor?.data?.attributes?.username || atributos.autor?.data?.attributes?.email || 'Estudiante',
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-PE')
}

const tieneHtml = (texto) => /<[^>]+>/i.test(texto)

const escaparHtml = (texto) => texto
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const aplicarFormatoInline = (texto) => texto
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')

const renderizarDescripcion = (textoOriginal) => {
  if (!textoOriginal) return '<p>Sin descripción</p>'

  if (tieneHtml(textoOriginal)) {
    return textoOriginal
  }

  const texto = escaparHtml(textoOriginal)
  const bloques = texto.split(/\n\s*\n/g)

  const html = bloques.map((bloque) => {
    const lineas = bloque.split('\n').filter((linea) => linea.trim())

    if (lineas.length === 0) return ''

    if (lineas.every((linea) => linea.trim().startsWith('- '))) {
      const items = lineas
        .map((linea) => `<li>${aplicarFormatoInline(linea.replace(/^\s*-\s*/, ''))}</li>`)
        .join('')
      return `<ul>${items}</ul>`
    }

    if (lineas.length === 1 && lineas[0].startsWith('### ')) {
      return `<h3>${aplicarFormatoInline(lineas[0].slice(4))}</h3>`
    }

    if (lineas.length === 1 && lineas[0].startsWith('## ')) {
      return `<h2>${aplicarFormatoInline(lineas[0].slice(3))}</h2>`
    }

    if (lineas.length === 1 && lineas[0].startsWith('# ')) {
      return `<h1>${aplicarFormatoInline(lineas[0].slice(2))}</h1>`
    }

    if (lineas.length === 1 && lineas[0].startsWith('&gt; ')) {
      return `<blockquote>${aplicarFormatoInline(lineas[0].slice(5))}</blockquote>`
    }

    return `<p>${aplicarFormatoInline(lineas.join('<br/>'))}</p>`
  }).join('')

  return html || '<p>Sin descripción</p>'
}

export default function PaginaDetallePublicacion() {
  const { id } = useParams()
  const [publicacion, setPublicacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarPublicacion = async () => {
      const jwt = localStorage.getItem('jwt')
      const headers = jwt
        ? { Authorization: `Bearer ${jwt}` }
        : undefined

      try {
        const respuesta = await fetch(`http://localhost:1337/api/publicacions/${id}?populate=autor`, {
          headers,
        })

        const datos = await respuesta.json()

        if (!respuesta.ok || !datos?.data) {
          throw new Error(datos?.error?.message || 'No se pudo cargar la publicación')
        }

        setPublicacion(normalizarPublicacion(datos.data))
      } catch (errorPeticion) {
        setError(errorPeticion.message || 'No se pudo cargar la publicación')
      } finally {
        setCargando(false)
      }
    }

    cargarPublicacion()
  }, [id])

  const claseEstado = useMemo(() => {
    if (!publicacion) return ''
    if (publicacion.estado === 'publicado') return estilos.badgeEstadoPublicado
    if (publicacion.estado === 'archivado') return estilos.badgeEstadoArchivado
    return estilos.badgeEstadoBorrador
  }, [publicacion])

  return (
    <div className={estilos.pagina}>
      <Navbar />
      <main className={estilos.main}>
        <nav className={estilos.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span>→</span>
          <Link to="/proyectos">Proyectos</Link>
          <span>→</span>
          <span>Detalle</span>
        </nav>

        {cargando && <div className={estilos.estado}>Cargando proyecto...</div>}
        {!cargando && error && <div className={estilos.estado}>{error}</div>}

        {!cargando && !error && publicacion && (
          <>
            <section className={estilos.hero}>
              <div className={estilos.heroTop}>
                <div className={estilos.badges}>
                  <span className={estilos.badge}>{publicacion.ciclo}</span>
                  <span className={estilos.badge}>{publicacion.tipo}</span>
                  <span className={`${estilos.badge} ${claseEstado}`}>{publicacion.estado}</span>
                </div>
              </div>

              <div className={estilos.tituloWrap}>
                <h1 className={estilos.titulo}>{publicacion.titulo}</h1>
                <p className={estilos.subtitulo}>
                  Categoría: <strong>{publicacion.categoria}</strong>
                </p>
              </div>

              {publicacion.imagen && (
                <div className={estilos.portadaWrap}>
                  <img src={publicacion.imagen} alt={publicacion.titulo} className={estilos.portada} />
                </div>
              )}

              <div className={estilos.gridMeta}>
                <div className={estilos.metaCard}>
                  <div className={estilos.metaLabel}>ESTUDIANTE</div>
                  <div className={estilos.metaValor}>{publicacion.autor}</div>
                </div>
                <div className={estilos.metaCard}>
                  <div className={estilos.metaLabel}>DOCENTE</div>
                  <div className={estilos.metaValor}>{publicacion.docente}</div>
                </div>
                <div className={estilos.metaCard}>
                  <div className={estilos.metaLabel}>TALLER</div>
                  <div className={estilos.metaValor}>{publicacion.taller}</div>
                </div>
                <div className={estilos.metaCard}>
                  <div className={estilos.metaLabel}>FECHA</div>
                  <div className={estilos.metaValor}>{formatearFecha(publicacion.fechaPublicacion)}</div>
                </div>
              </div>
            </section>

            <section className={estilos.contenido}>
              <h2 className={estilos.tituloSeccion}>Descripción del proyecto</h2>
              <div
                className={estilos.texto}
                dangerouslySetInnerHTML={{ __html: renderizarDescripcion(publicacion.descripcion) }}
              />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
