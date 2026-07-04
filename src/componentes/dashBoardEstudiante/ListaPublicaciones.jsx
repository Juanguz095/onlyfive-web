import { useState } from 'react'
import { Edit, GripVertical } from 'lucide-react'
import estilos from './ListaPublicaciones.module.css'

export default function ListaPublicaciones({ publicaciones }) {
  const [filtroActivo, setFiltroActivo] = useState('Todas')

  const publicacionesFiltradas = publicaciones.filter((p) => {
    if (filtroActivo === 'Todas') return true
    if (filtroActivo === 'Publicadas') return p.estado === 'publicado'
    if (filtroActivo === 'Borradores') return p.estado === 'borrador'
    return true
  })

  return (
    <div>
      <div className={estilos.filaListaTitulo}>
        <h2 className={estilos.tituloLista}>Mis publicaciones</h2>
        <div className={estilos.filtrosLista}>
          {['Todas', 'Publicadas', 'Borradores'].map((f) => (
            <button
              key={f}
              className={`${estilos.chipFiltro} ${filtroActivo === f ? estilos.chipFiltroActivo : ''}`}
              onClick={() => setFiltroActivo(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={estilos.listaPublicaciones}>
        {publicacionesFiltradas.map((p, i) => (
          <div
            key={p.id || i}
            className={`${estilos.filaPublicacion} ${p.estado === 'borrador' ? estilos.filaBorrador : ''}`}
          >
            <div className={estilos.miniatura} />
            <div className={estilos.infoPublicacion}>
              <div className={estilos.tituloPublicacion}>{p.titulo}</div>
              <div className={estilos.metaPublicacion}>
                <span className={p.estado === 'publicado' ? estilos.badgePublicada : estilos.badgeBorrador}>
                  {p.estado}
                </span>
                <span className={estilos.metaTexto}>{p.categoria}</span>
                <span className={estilos.metaTexto}>
                  {p.fecha_publicacion ? new Date(p.fecha_publicacion).toLocaleDateString('es-PE') : 'Sin fecha'}
                </span>
              </div>
            </div>
            <div className={estilos.accionesFila}>
              <button className={estilos.btnIcono} aria-label="Editar">
                <Edit size={14} />
              </button>
              <button className={estilos.btnIcono} aria-label="Reordenar">
                <GripVertical size={14} color="#aaa" />
              </button>
            </div>
          </div>
        ))}
        {publicacionesFiltradas.length === 0 && <p>No hay publicaciones para mostrar.</p>}
      </div>
    </div>
  )
}
