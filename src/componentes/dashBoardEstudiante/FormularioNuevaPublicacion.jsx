import { useEffect, useMemo, useState } from 'react'
import estilos from './FormularioNuevaPublicacion.module.css'

const CICLOS = ['CICLO I', 'CICLO II', 'CICLO III', 'CICLO IV', 'CICLO V', 'CICLO VI']
const TIPOS = ['PROYECTOS', 'TALLERES', 'EVENTOS']
const ESTADOS = ['borrador', 'publicado']
const TALLERES = [
  'Sin asignar',
  'Cocina Básica I',
  'Cocina Básica II',
  'Cocina Creativa I',
  'Cocina Creativa II',
  'Repostería Avanzada',
  'Pastelería Profesional',
  'Técnicas Culinarias',
  'Gestión de Cocina',
]
const DOCENTES = [
  'Sin asignar',
  'Prof. Carlos Mendoza',
  'Prof. Lucía Huamán',
  'Prof. Ricardo Torres',
  'Prof. María Fernández',
  'Prof. Diego Paredes',
]

export default function FormularioNuevaPublicacion({
  modo = 'crear',
  publicacionInicial = null,
  onCreada,
  onActualizada,
  onCerrar,
}) {
  const esEdicion = modo === 'editar' && Boolean(publicacionInicial?.id)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ciclo, setCiclo] = useState('CICLO I')
  const [tipo, setTipo] = useState('PROYECTOS')
  const [estado, setEstado] = useState('borrador')
  const [taller, setTaller] = useState('Sin asignar')
  const [docente, setDocente] = useState('Sin asignar')
  const [fechaPublicacion, setFechaPublicacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!esEdicion || !publicacionInicial) {
      setTitulo('')
      setDescripcion('')
      setCategoria('')
      setCiclo('CICLO I')
      setTipo('PROYECTOS')
      setEstado('borrador')
      setTaller('Sin asignar')
      setDocente('Sin asignar')
      setFechaPublicacion('')
      return
    }

    setTitulo(publicacionInicial.titulo || '')
    setDescripcion(publicacionInicial.descripcion || '')
    setCategoria(publicacionInicial.categoria || '')
    setCiclo(CICLOS.includes(publicacionInicial.ciclo) ? publicacionInicial.ciclo : 'CICLO I')
    setTipo(TIPOS.includes(publicacionInicial.tipo) ? publicacionInicial.tipo : 'PROYECTOS')
    setEstado(ESTADOS.includes(publicacionInicial.estado) ? publicacionInicial.estado : 'borrador')
    setTaller(TALLERES.includes(publicacionInicial.taller) ? publicacionInicial.taller : 'Sin asignar')
    setDocente(DOCENTES.includes(publicacionInicial.docente) ? publicacionInicial.docente : 'Sin asignar')
    setFechaPublicacion(publicacionInicial.fecha_publicacion || '')
  }, [esEdicion, publicacionInicial])

  const etiquetaTitulo = useMemo(() => (esEdicion ? 'Editar publicación' : 'Nueva publicación'), [esEdicion])
  const etiquetaBoton = useMemo(() => {
    if (cargando) return 'Guardando...'
    return esEdicion ? 'Guardar cambios' : 'Guardar publicación'
  }, [cargando, esEdicion])

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      setError('Tu sesión expiró. Inicia sesión nuevamente.')
      return
    }

    if (!titulo.trim()) {
      setError('El título es obligatorio.')
      return
    }

    setCargando(true)
    setError('')

    const fechaDefinitiva = estado === 'publicado'
      ? (fechaPublicacion || new Date().toISOString())
      : null

    const payload = {
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria.trim(),
        ciclo,
        tipo,
        taller: taller === 'Sin asignar' ? '' : taller,
        docente: docente === 'Sin asignar' ? '' : docente,
        estado,
        fecha_publicacion: fechaDefinitiva,
      },
    }

    try {
      const endpoint = esEdicion
        ? `http://localhost:1337/api/publicacions/${publicacionInicial.id}`
        : 'http://localhost:1337/api/publicacions'

      const respuesta = await fetch(endpoint, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos?.data) {
        throw new Error(datos?.error?.message || 'No se pudo guardar la publicación')
      }

      if (esEdicion) {
        if (onActualizada) onActualizada(datos.data)
      } else {
        if (onCreada) onCreada(datos.data)
        setTitulo('')
        setDescripcion('')
        setCategoria('')
        setCiclo('CICLO I')
        setTipo('PROYECTOS')
        setEstado('borrador')
        setTaller('Sin asignar')
        setDocente('Sin asignar')
        setFechaPublicacion('')
      }
    } catch (errorPeticion) {
      setError(errorPeticion.message || 'No se pudo guardar la publicación')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className={estilos.contenedor}>
      <div className={estilos.cabecera}>
        <h2 className={estilos.titulo}>{etiquetaTitulo}</h2>
        <button type="button" className={estilos.btnCerrar} onClick={onCerrar}>Cerrar</button>
      </div>

      <form className={estilos.formulario} onSubmit={manejarEnvio}>
        <label className={estilos.grupoCampo}>
          <span>Título</span>
          <input
            className={estilos.campo}
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            placeholder="Ej. Menú degustación del ciclo V"
            required
          />
        </label>

        <label className={estilos.grupoCampo}>
          <span>Descripción</span>
          <textarea
            className={`${estilos.campo} ${estilos.areaTexto}`}
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            placeholder="Describe brevemente la publicación"
          />
        </label>

        <div className={estilos.gridCampos}>
          <label className={estilos.grupoCampo}>
            <span>Categoría</span>
            <input
              className={estilos.campo}
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
              placeholder="Gastronomía peruana"
            />
          </label>

          <label className={estilos.grupoCampo}>
            <span>Ciclo</span>
            <select className={estilos.campo} value={ciclo} onChange={(evento) => setCiclo(evento.target.value)}>
              {CICLOS.map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>

          <label className={estilos.grupoCampo}>
            <span>Tipo</span>
            <select className={estilos.campo} value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              {TIPOS.map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>

          <label className={estilos.grupoCampo}>
            <span>Estado</span>
            <select className={estilos.campo} value={estado} onChange={(evento) => setEstado(evento.target.value)}>
              {ESTADOS.map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>

          <label className={estilos.grupoCampo}>
            <span>Taller</span>
            <select className={estilos.campo} value={taller} onChange={(evento) => setTaller(evento.target.value)}>
              {TALLERES.map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>

          <label className={estilos.grupoCampo}>
            <span>Docente</span>
            <select className={estilos.campo} value={docente} onChange={(evento) => setDocente(evento.target.value)}>
              {DOCENTES.map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className={estilos.error}>{error}</p>}

        <div className={estilos.acciones}>
          <button type="submit" className={estilos.btnPrincipal} disabled={cargando}>
            {etiquetaBoton}
          </button>
        </div>
      </form>
    </section>
  )
}
