import { useMemo, useState } from 'react'
import { Edit, Eye, Plus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import estilos from './ListaPublicaciones.module.css'

export default function ListaPublicaciones({
  publicaciones,
  onEditarPublicacion,
  onAgregarAlPortafolio,
  idsEnPortafolio = [],
  bloqueandoPortafolio = false,
}) {
  const [filtroActivo, setFiltroActivo] = useState('Todas')
  const navegar = useNavigate()

  const idsEnPortafolioSet = useMemo(() => new Set(idsEnPortafolio), [idsEnPortafolio])

  const publicacionesFiltradas = publicaciones.filter((p) => {
    if (filtroActivo === 'Todas') return true
    if (filtroActivo === 'Publicadas') return p.estado === 'publicado'
    if (filtroActivo === 'Borradores') return p.estado === 'borrador'
    return true
  })

  const irADetalle = (publicacionId) => {
    navegar(`/publicacion/${publicacionId}`)
  }

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
        {publicacionesFiltradas.map((p, i) => {
          const estaEnPortafolio = idsEnPortafolioSet.has(p.id)

          return (
            <div
              key={p.id || i}
              className={`${estilos.filaPublicacion} ${p.estado === 'borrador' ? estilos.filaBorrador : ''}`}
            >
              <div className={estilos.miniatura}>
                {p.imagen && <img src={p.imagen} alt={p.titulo} className={estilos.miniaturaImagen} />}
              </div>
              <div className={estilos.infoPublicacion}>
                <button className={estilos.btnTitulo} onClick={() => irADetalle(p.id)}>
                  {p.titulo}
                </button>
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
                <button
                  className={estilos.btnIcono}
                  aria-label="Editar"
                  onClick={() => onEditarPublicacion && onEditarPublicacion(p)}
                >
                  <Edit size={14} />
                </button>
                <button className={estilos.btnIcono} aria-label="Ver publicación" onClick={() => irADetalle(p.id)}>
                  <Eye size={14} />
                </button>

                <button
                  className={`${estilos.btnAgregarPortafolio} ${estaEnPortafolio ? estilos.btnAgregarPortafolioActivo : ''}`}
                  aria-label={estaEnPortafolio ? 'Ya está en portafolio' : 'Agregar al portafolio'}
                  disabled={estaEnPortafolio || bloqueandoPortafolio}
                  onClick={() => {
                    if (!estaEnPortafolio && onAgregarAlPortafolio) {
                      onAgregarAlPortafolio(p)
                    }
                  }}
                >
                  {estaEnPortafolio ? <Check size={14} /> : <Plus size={14} />}
                </button>
              </div>
            </div>
          )
        })}
        {publicacionesFiltradas.length === 0 && <p>No hay publicaciones para mostrar.</p>}
      </div>
    </div>
  )
}
