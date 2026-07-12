import { useState } from 'react'
import { Eye, Copy, FileDown } from 'lucide-react'
import estilos from './AccionesPortafolio.module.css'

export default function AccionesPortafolio({ enlacePublicoPortafolio }) {
  const [mensaje, setMensaje] = useState('')



  const mostrarMensaje = (texto) => {
    setMensaje(texto)
    window.setTimeout(() => setMensaje(''), 2500)
  }

  const abrirVistaPublica = () => {
    if (!enlacePublicoPortafolio) {
      mostrarMensaje('Aún no se encontró un enlace compartible para este portafolio.')
      return
    }

    window.open(enlacePublicoPortafolio, '_blank', 'noopener,noreferrer')
  }

  const copiarEnlace = async () => {
    if (!enlacePublicoPortafolio) {
      mostrarMensaje('Aún no se encontró un enlace compartible para este portafolio.')
      return
    }

    try {
      await navigator.clipboard.writeText(enlacePublicoPortafolio)
      mostrarMensaje('Enlace copiado al portapapeles.')
    } catch {
      mostrarMensaje('No se pudo copiar automáticamente. Copia manualmente la URL.')
    }
  }

  const exportarPDF = () => {
    if (!enlacePublicoPortafolio) {
      mostrarMensaje('Aún no se encontró un enlace compartible para este portafolio.')
      return
    }

    const separador = enlacePublicoPortafolio.includes('?') ? '&' : '?'
    const enlaceImpresion = `${enlacePublicoPortafolio}${separador}print=1`
    window.open(enlaceImpresion, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={estilos.contenedorAcciones}>
      <div className={estilos.accionesTop}>
        <button className={estilos.btnVerPublica} onClick={abrirVistaPublica}>
          <Eye size={14} />
          <span>Ver vista pública</span>
        </button>
        <button className={estilos.btnSecundario} onClick={copiarEnlace}>
          <Copy size={14} />
          <span>Copiar enlace</span>
        </button>
        <button className={estilos.btnSecundario} onClick={exportarPDF}>
          <FileDown size={14} />
          <span>Exportar PDF</span>
        </button>
      </div>
      {mensaje && <p className={estilos.mensaje}>{mensaje}</p>}
    </div>
  )
}