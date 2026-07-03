import { Eye, Copy, FileDown } from 'lucide-react'
import estilos from './AccionesPortafolio.module.css'

export default function AccionesPortafolio() {
  return (
    <div className={estilos.accionesTop}>
      <button className={estilos.btnVerPublica}>
        <Eye size={14} />
        <span>Ver vista pública</span>
      </button>
      <button className={estilos.btnSecundario}>
        <Copy size={14} />
        <span>Copiar enlace</span>
      </button>
      <button className={estilos.btnSecundario}>
        <FileDown size={14} />
        <span>Exportar PDF</span>
      </button>
    </div>
  )
}