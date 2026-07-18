import { Link } from 'react-router-dom'
import estilos from './ItemArticulo.module.css'

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function ItemArticulo({ articulo }) {
  return (
    <article className={estilos.item}>
      <div className={estilos.texto}>
        <div className={estilos.filaMetaTop}>
          <span className={estilos.categoria}>{articulo.categoria || 'General'}</span>
        </div>
        <Link className={estilos.tituloLink} to={`/articulo/${articulo.id}`}>
          <h3 className={estilos.titulo}>{articulo.titulo}</h3>
        </Link>
        <p className={estilos.resumen}>{articulo.resumen || 'Sin resumen disponible.'}</p>
        <div className={estilos.filaMetaBottom}>
          <span className={estilos.meta}>{articulo.autor || 'Autor'}</span>
          <span className={estilos.punto}>·</span>
          <span className={estilos.meta}>{formatearFecha(articulo.fecha_publicacion)}</span>
          <Link className={estilos.leer} to={`/articulo/${articulo.id}`}>Leer</Link>
        </div>
      </div>

      {articulo.imagen && (
        <Link className={estilos.miniaturaLink} to={`/articulo/${articulo.id}`} aria-label={articulo.titulo}>
          <img className={estilos.miniatura} src={articulo.imagen} alt={articulo.titulo} />
        </Link>
      )}
    </article>
  )
}
