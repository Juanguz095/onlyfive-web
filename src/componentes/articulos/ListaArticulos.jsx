import TarjetaArticulo from './TarjetaArticulo'
import estilos from './ListaArticulos.module.css'

export default function ListaArticulos({ articulos }) {
  return (
    <div className={estilos.gridArticulos}>
      {articulos.map((articulo) => (
        <TarjetaArticulo key={articulo.id} articulo={articulo} />
      ))}
    </div>
  )
}
