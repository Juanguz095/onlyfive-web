import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const normalizarPublicacion = (dato) => {
  const atributos = dato?.attributes || {}

  return {
    id: dato?.id,
    titulo: atributos.titulo || 'Sin título',
    descripcion: atributos.descripcion || 'Sin descripción',
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

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '24px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#4361ee', textDecoration: 'none', fontSize: '13px' }}>← Inicio</Link>
          <Link to="/dashboard" style={{ color: '#4361ee', textDecoration: 'none', fontSize: '13px' }}>Ir al dashboard</Link>
        </div>

        {cargando && <p>Cargando publicación...</p>}
        {error && <p>{error}</p>}

        {!cargando && !error && publicacion && (
          <article
            style={{
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              padding: '22px',
              background: '#fcfcfc',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {publicacion.ciclo} · {publicacion.tipo} · {publicacion.estado}
            </p>
            <h1 style={{ margin: '8px 0 6px', color: '#111', fontSize: '30px', lineHeight: 1.2 }}>
              {publicacion.titulo}
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
              Categoría: {publicacion.categoria}
            </p>

            <div style={{ marginTop: '16px', display: 'grid', gap: '8px', fontSize: '13px', color: '#444' }}>
              <p style={{ margin: 0 }}><strong>Estudiante:</strong> {publicacion.autor}</p>
              <p style={{ margin: 0 }}><strong>Taller:</strong> {publicacion.taller}</p>
              <p style={{ margin: 0 }}><strong>Docente:</strong> {publicacion.docente}</p>
              <p style={{ margin: 0 }}>
                <strong>Fecha:</strong>{' '}
                {publicacion.fechaPublicacion
                  ? new Date(publicacion.fechaPublicacion).toLocaleDateString('es-PE')
                  : 'Sin fecha'}
              </p>
            </div>

            <div style={{ marginTop: '18px', borderTop: '1px solid #ebebeb', paddingTop: '16px' }}>
              <h2 style={{ margin: '0 0 8px', color: '#111', fontSize: '18px' }}>Descripción del proyecto</h2>
              <p style={{ margin: 0, color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {publicacion.descripcion}
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
