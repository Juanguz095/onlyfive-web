import AccionesPortafolio from './AccionesPortafolio'
import estilos from './EncabezadoPortafolio.module.css'

export default function EncabezadoPortafolio({ titulo, labelPanel }) {
  return (
    <div className={estilos.encabezado}>
      <div>
        <span className={estilos.label}>{labelPanel}</span>
        <h1 className={estilos.titulo}>{titulo}</h1>
      </div>
      <AccionesPortafolio />
    </div>
  )
}