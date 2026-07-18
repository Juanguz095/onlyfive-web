import ItemArticulo from './ItemArticulo'
import estilos from './ListaArticulos.module.css'

export default function ListaArticulos({ articulos }) {
  return (
    <div className={estilos.lista}>
      {articulos.map((articulo) => (
        <ItemArticulo key={articulo.id} articulo={articulo} />
      ))}
    </div>
  )
}
