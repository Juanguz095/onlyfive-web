import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

const normalizarPublicacion = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.attributes?.titulo || '',
  estado: publicacion.attributes?.estado || 'borrador',
  categoria: publicacion.attributes?.categoria || 'Sin categoría',
  fecha_publicacion: publicacion.attributes?.fecha_publicacion || '',
  descripcion: publicacion.attributes?.descripcion || '',
})

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

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '28px 16px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#777', letterSpacing: '0.03em' }}>PORTAFOLIO PÚBLICO</p>
          <h1 style={{ margin: '8px 0 10px', fontSize: '30px', color: '#111' }}>
            {portafolio?.attributes?.titulo || 'Portafolio'}
          </h1>
          {portafolio?.attributes?.descripcion && (
            <p style={{ margin: 0, maxWidth: '800px', color: '#555', lineHeight: 1.55 }}>
              {portafolio.attributes.descripcion}
            </p>
          )}
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#777' }}>
            Publicaciones visibles: {publicaciones.length}
          </p>
        </header>

        {cargando && <p>Cargando portafolio...</p>}
        {error && <p>{error}</p>}

        {!cargando && !error && (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
              {publicaciones.map((publicacion) => (
                <li
                  key={publicacion.id}
                  style={{
                    border: '1px solid #e9e9e9',
                    borderRadius: '10px',
                    padding: '16px',
                    background: '#fafafa',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '18px', color: '#111' }}>{publicacion.titulo}</h2>
                  <p style={{ margin: '7px 0 0', color: '#666', fontSize: '13px' }}>
                    {publicacion.categoria} · {publicacion.estado} ·{' '}
                    {publicacion.fecha_publicacion
                      ? new Date(publicacion.fecha_publicacion).toLocaleDateString('es-PE')
                      : 'Sin fecha'}
                  </p>
                  {publicacion.descripcion && (
                    <p style={{ margin: '10px 0 0', color: '#444', lineHeight: 1.6 }}>{publicacion.descripcion}</p>
                  )}
                </li>
              ))}
            </ul>

            {publicaciones.length === 0 && (
              <p style={{ marginTop: '10px' }}>Este portafolio no tiene publicaciones disponibles para vista pública.</p>
            )}
          </>
        )}

        <div style={{ marginTop: '22px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#4361ee', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
