import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Copy, FileDown } from 'lucide-react'
import estilos from './AccionesPortafolio.module.css'

const copiarConFallback = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = texto
      area.setAttribute('readonly', 'true')
      area.style.position = 'absolute'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const resultado = document.execCommand('copy')
      document.body.removeChild(area)
      return Boolean(resultado)
    } catch {
      return false
    }
  }
}

export default function AccionesPortafolio({ enlacePublicoPortafolio }) {
  const navegar = useNavigate()
  const [mensaje, setMensaje] = useState('')

  const mostrarMensaje = (texto) => {
    setMensaje(texto)
    window.setTimeout(() => setMensaje(''), 2500)
  }

  const validarEnlace = () => {
    if (enlacePublicoPortafolio) return true

    mostrarMensaje('Activa el modo público desde la página Portafolio para usar esta acción.')
    window.setTimeout(() => navegar('/portafolio'), 600)
    return false
  }

  const abrirVistaPublica = () => {
    if (!validarEnlace()) return
    window.open(enlacePublicoPortafolio, '_blank', 'noopener,noreferrer')
  }

  const copiarEnlace = async () => {
    if (!validarEnlace()) return

    const copiado = await copiarConFallback(enlacePublicoPortafolio)
    mostrarMensaje(copiado ? 'Enlace copiado al portapapeles.' : 'No se pudo copiar automáticamente.')
  }

  const exportarPDF = () => {
    if (!validarEnlace()) return

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
