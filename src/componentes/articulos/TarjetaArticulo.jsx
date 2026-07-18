import { Link } from 'react-router-dom'
import estilos from './TarjetaArticulo.module.css'

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return new Date(fecha).toLocaleDateString('es-PE')
}

export default function TarjetaArticulo({ articulo }) {
  return (
    <article className={estilos.tarjeta}>
      <div className={estilos.tarjetaImagen}>
        {articulo.imagen && <img className={estilos.imagenPortada} src={articulo.imagen} alt={articulo.titulo} />}
        <span className={estilos.badgeCategoria}>{articulo.categoria || 'General'}</span>
      </div>
      <div className={estilos.tarjetaCuerpo}>
        <h3 className={estilos.tarjetaTitulo}>{articulo.titulo}</h3>
        <p className={estilos.tarjetaDesc}>{articulo.resumen || 'Sin resumen disponible.'}</p>
        <div className={estilos.tarjetaMeta}>
          <div className={estilos.metaFila}>
            <span className={estilos.metaTexto}>{formatearFecha(articulo.fecha_publicacion)}</span>
            <span className={estilos.metaTexto}>{articulo.autor || 'Estudiante'}</span>
          </div>
        </div>
        <Link className={estilos.btnVerProyecto} to={`/articulo/${articulo.id}`}>
          Leer artículo
        </Link>
      </div>
    </article>
  )
}
