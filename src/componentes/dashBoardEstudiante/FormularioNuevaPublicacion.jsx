import { useEffect, useMemo, useRef, useState } from 'react'
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

const tieneEtiquetasHtml = (texto) => /<\/?[a-z][\s\S]*>/i.test(texto)

const escaparHtml = (texto) => String(texto || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const aplicarFormatoInline = (texto) => texto
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')

const textoPlanoAHtmlBasico = (textoOriginal) => {
  if (!textoOriginal) return ''

  const texto = escaparHtml(textoOriginal)
  const bloques = texto.split(/\n\s*\n/g)

  return bloques.map((bloque) => {
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
}

const normalizarDescripcionParaEditor = (valor) => {
  if (!valor) return ''
  if (tieneEtiquetasHtml(valor)) return valor
  return textoPlanoAHtmlBasico(valor)
}

const quitarHtml = (html) => String(html || '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const sanearHtmlBasico = (html) => String(html || '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  .replace(/\son\w+='[^']*'/gi, '')
  .replace(/javascript:/gi, '')
  .trim()

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
  const [imagenUrl, setImagenUrl] = useState('')
  const [imagenArchivo, setImagenArchivo] = useState(null)
  const [previewArchivo, setPreviewArchivo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [formatoActivo, setFormatoActivo] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  const editorRef = useRef(null)
  const objetoUrlRef = useRef('')

  useEffect(() => {
    return () => {
      if (objetoUrlRef.current) {
        URL.revokeObjectURL(objetoUrlRef.current)
      }
    }
  }, [])

  const limpiarPreviewArchivo = () => {
    if (objetoUrlRef.current) {
      URL.revokeObjectURL(objetoUrlRef.current)
      objetoUrlRef.current = ''
    }
    setPreviewArchivo('')
  }

  const actualizarPreviewArchivo = (archivo) => {
    limpiarPreviewArchivo()

    if (!archivo) return

    const urlTemporal = URL.createObjectURL(archivo)
    objetoUrlRef.current = urlTemporal
    setPreviewArchivo(urlTemporal)
  }

  useEffect(() => {
    const descripcionInicial = (!esEdicion || !publicacionInicial)
      ? ''
      : normalizarDescripcionParaEditor(publicacionInicial.descripcion || '')

    if (!esEdicion || !publicacionInicial) {
      setTitulo('')
      setCategoria('')
      setCiclo('CICLO I')
      setTipo('PROYECTOS')
      setEstado('borrador')
      setTaller('Sin asignar')
      setDocente('Sin asignar')
      setFechaPublicacion('')
      setImagenUrl('')
      setImagenArchivo(null)
      limpiarPreviewArchivo()
    } else {
      setTitulo(publicacionInicial.titulo || '')
      setCategoria(publicacionInicial.categoria || '')
      setCiclo(CICLOS.includes(publicacionInicial.ciclo) ? publicacionInicial.ciclo : 'CICLO I')
      setTipo(TIPOS.includes(publicacionInicial.tipo) ? publicacionInicial.tipo : 'PROYECTOS')
      setEstado(ESTADOS.includes(publicacionInicial.estado) ? publicacionInicial.estado : 'borrador')
      setTaller(TALLERES.includes(publicacionInicial.taller) ? publicacionInicial.taller : 'Sin asignar')
      setDocente(DOCENTES.includes(publicacionInicial.docente) ? publicacionInicial.docente : 'Sin asignar')
      setFechaPublicacion(publicacionInicial.fecha_publicacion || '')
      setImagenUrl(publicacionInicial.imagen || '')
      setImagenArchivo(null)
      limpiarPreviewArchivo()
    }

    setDescripcion(descripcionInicial)

    if (editorRef.current) {
      editorRef.current.innerHTML = descripcionInicial
    }

    limpiarEstadoFormato()
  }, [esEdicion, publicacionInicial])

  const etiquetaTitulo = useMemo(() => (esEdicion ? 'Editar publicación' : 'Nueva publicación'), [esEdicion])
  const etiquetaBoton = useMemo(() => {
    if (cargando) return 'Guardando...'
    return esEdicion ? 'Guardar cambios' : 'Guardar publicación'
  }, [cargando, esEdicion])

  const vistaPreviaImagen = previewArchivo || imagenUrl.trim()

  const limpiarEstadoFormato = () => {
    setFormatoActivo({
      bold: false,
      italic: false,
      underline: false,
    })
  }

  const actualizarEstadoFormato = () => {
    if (!editorRef.current) return

    const seleccion = window.getSelection()
    const ancla = seleccion?.anchorNode || null

    if (!ancla || !editorRef.current.contains(ancla)) {
      limpiarEstadoFormato()
      return
    }

    setFormatoActivo({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    })
  }

  const sincronizarDescripcionDesdeEditor = () => {
    if (!editorRef.current) return
    setDescripcion(editorRef.current.innerHTML)
    actualizarEstadoFormato()
  }

  useEffect(() => {
    const manejarCambioSeleccion = () => {
      actualizarEstadoFormato()
    }

    document.addEventListener('selectionchange', manejarCambioSeleccion)
    return () => {
      document.removeEventListener('selectionchange', manejarCambioSeleccion)
    }
  }, [])

  const ejecutarComando = (comando, valor = null) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(comando, false, valor)
    sincronizarDescripcionDesdeEditor()
    actualizarEstadoFormato()
  }

  const aplicarBloque = (tipo) => {
    if (tipo === 'parrafo') ejecutarComando('formatBlock', 'p')
    if (tipo === 'h2') ejecutarComando('formatBlock', 'h2')
    if (tipo === 'h3') ejecutarComando('formatBlock', 'h3')
    if (tipo === 'cita') ejecutarComando('formatBlock', 'blockquote')
  }

  const insertarEnlace = () => {
    const url = window.prompt('Ingresa la URL del enlace')
    if (!url) return
    ejecutarComando('createLink', url)
  }

  const manejarMouseDownToolbar = (evento) => {
    evento.preventDefault()
  }

  const manejarCambioArchivo = (evento) => {
    const archivo = evento.target.files?.[0] || null
    setImagenArchivo(archivo)
    actualizarPreviewArchivo(archivo)
    if (archivo) {
      setImagenUrl('')
    }
  }

  const limpiarImagen = () => {
    setImagenArchivo(null)
    setImagenUrl('')
    limpiarPreviewArchivo()
  }

  const subirImagen = async (jwt) => {
    if (!imagenArchivo) {
      return imagenUrl.trim()
    }

    const formData = new FormData()
    formData.append('files', imagenArchivo)

    const respuesta = await fetch('http://localhost:1337/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    })

    const datos = await respuesta.json()

    if (!respuesta.ok || !Array.isArray(datos) || !datos[0]?.url) {
      throw new Error('No se pudo subir la imagen. Verifica permisos de upload en Strapi.')
    }

    const urlSubida = datos[0].url
    return urlSubida.startsWith('http') ? urlSubida : `http://localhost:1337${urlSubida}`
  }

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

    try {
      const imagenDefinitiva = await subirImagen(jwt)

      const fechaDefinitiva = estado === 'publicado'
        ? (fechaPublicacion || new Date().toISOString())
        : fechaPublicacion || null

      const descripcionSafe = sanearHtmlBasico(descripcion)
      const descripcionDefinitiva = quitarHtml(descripcionSafe) ? descripcionSafe : ''

      const payload = {
        data: {
          titulo: titulo.trim(),
          descripcion: descripcionDefinitiva,
          categoria: categoria.trim(),
          ciclo,
          tipo,
          taller: taller === 'Sin asignar' ? '' : taller,
          docente: docente === 'Sin asignar' ? '' : docente,
          estado,
          fecha_publicacion: fechaDefinitiva,
          imagen: imagenDefinitiva || '',
        },
      }

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
        setImagenUrl('')
        setImagenArchivo(null)
        limpiarPreviewArchivo()
        if (editorRef.current) editorRef.current.innerHTML = ''
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

        <div className={estilos.grupoCampo}>
          <span>Contenido</span>
          <div className={estilos.editorWrap}>
            <div className={estilos.editorToolbar}>
              <div className={estilos.toolbarGrupo}>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => aplicarBloque('parrafo')}>Párrafo</button>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => aplicarBloque('h2')}>Título</button>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => aplicarBloque('h3')}>Subtítulo</button>
              </div>

              <div className={estilos.toolbarGrupo}>
                <button
                  type="button"
                  className={`${estilos.btnToolbar} ${formatoActivo.bold ? estilos.btnToolbarActivo : ''}`}
                  onMouseDown={manejarMouseDownToolbar}
                  onClick={() => ejecutarComando('bold')}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className={`${estilos.btnToolbar} ${formatoActivo.italic ? estilos.btnToolbarActivo : ''}`}
                  onMouseDown={manejarMouseDownToolbar}
                  onClick={() => ejecutarComando('italic')}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className={`${estilos.btnToolbar} ${formatoActivo.underline ? estilos.btnToolbarActivo : ''}`}
                  onMouseDown={manejarMouseDownToolbar}
                  onClick={() => ejecutarComando('underline')}
                >
                  <span className={estilos.subrayado}>U</span>
                </button>
              </div>

              <div className={estilos.toolbarGrupo}>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => ejecutarComando('insertUnorderedList')}>Lista</button>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => aplicarBloque('cita')}>Cita</button>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={insertarEnlace}>Enlace</button>
                <button type="button" className={estilos.btnToolbar} onMouseDown={manejarMouseDownToolbar} onClick={() => ejecutarComando('removeFormat')}>Limpiar</button>
              </div>
            </div>

            <div className={estilos.hoja}>
              <div
                ref={editorRef}
                className={estilos.editorTexto}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Escribe aquí como en un documento..."
                onInput={sincronizarDescripcionDesdeEditor}
                onKeyUp={actualizarEstadoFormato}
                onMouseUp={actualizarEstadoFormato}
                onFocus={actualizarEstadoFormato}
                onBlur={limpiarEstadoFormato}
              />
            </div>
          </div>
        </div>

        <div className={estilos.grupoCampo}>
          <span>Imagen</span>
          <div className={estilos.gridImagen}>
            <input
              className={estilos.campo}
              value={imagenUrl}
              onChange={(evento) => {
                setImagenUrl(evento.target.value)
                if (evento.target.value.trim()) {
                  setImagenArchivo(null)
                  limpiarPreviewArchivo()
                }
              }}
              placeholder="Pega una URL de imagen o sube un archivo"
            />
            <input
              className={estilos.campoArchivo}
              type="file"
              accept="image/*"
              onChange={manejarCambioArchivo}
            />
          </div>

          {vistaPreviaImagen && (
            <div className={estilos.previewWrap}>
              <img src={vistaPreviaImagen} alt="Vista previa" className={estilos.previewImagen} />
              <button type="button" className={estilos.btnQuitarImagen} onClick={limpiarImagen}>Quitar imagen</button>
            </div>
          )}
        </div>

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
