import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import estilos from './SeccionComentarios.module.css'

const obtenerNombreAutor = (comentario) => {
  const autor = comentario?.attributes?.autor?.data?.attributes
  return autor?.username || autor?.email || 'Usuario'
}

const obtenerIniciales = (nombre) => (
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleString('es-PE')
}

export default function SeccionComentarios({ articuloId }) {
  const [comentarios, setComentarios] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [publicando, setPublicando] = useState(false)
  const [error, setError] = useState('')
  const jwt = localStorage.getItem('jwt')

  const estaAutenticado = useMemo(() => Boolean(jwt), [jwt])

  const cargarComentarios = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:1337/api/comentarios?filters[articulo][id][$eq]=${articuloId}&populate=autor&sort=fecha:desc`
      )
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los comentarios')
      }

      setComentarios(datos.data || [])
    } catch {
      setError('Error al cargar comentarios')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarComentarios()
  }, [articuloId])

  const publicarComentario = async () => {
    const mensaje = texto.trim()
    if (!mensaje) return

    if (!jwt) return

    setPublicando(true)
    setError('')

    try {
      const respuesta = await fetch('http://localhost:1337/api/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            texto: mensaje,
            articulo: articuloId,
            fecha: new Date().toISOString(),
          },
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos?.data) {
        throw new Error(datos?.error?.message || 'No se pudo publicar el comentario')
      }

      setTexto('')
      await cargarComentarios()
    } catch {
      setError('No se pudo publicar el comentario')
    } finally {
      setPublicando(false)
    }
  }

  return (
    <section className={estilos.seccion}>
      <h3 className={estilos.titulo}>Comentarios</h3>

      {estaAutenticado ? (
        <div className={estilos.formularioComentario}>
          <textarea
            className={estilos.textarea}
            placeholder="Escribe tu comentario"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
          />
          <button className={estilos.btnPublicar} onClick={publicarComentario} disabled={publicando}>
            {publicando ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </div>
      ) : (
        <p className={estilos.mensajeLogin}>
          Inicia sesión para comentar. <Link to="/login">Ir a login</Link>
        </p>
      )}

      {cargando && <p className={estilos.estado}>Cargando comentarios...</p>}
      {!cargando && error && <p className={estilos.estado}>{error}</p>}

      {!cargando && !error && (
        <div className={estilos.listaComentarios}>
          {comentarios.map((comentario) => {
            const nombre = obtenerNombreAutor(comentario)
            return (
              <article key={comentario.id} className={estilos.itemComentario}>
                <div className={estilos.avatar}>{obtenerIniciales(nombre)}</div>
                <div className={estilos.infoComentario}>
                  <div className={estilos.cabeceraComentario}>
                    <span className={estilos.nombreAutor}>{nombre}</span>
                    <span className={estilos.fecha}>{formatearFecha(comentario.attributes?.fecha)}</span>
                  </div>
                  <p className={estilos.texto}>{comentario.attributes?.texto}</p>
                </div>
              </article>
            )
          })}
          {comentarios.length === 0 && <p className={estilos.estado}>Aún no hay comentarios.</p>}
        </div>
      )}
    </section>
  )
}
