import estilos from './TarjetasMetricas.module.css'

export default function TarjetasMetricas({ publicaciones }) {
  const totalPublicaciones = publicaciones.length
  const publicadas = publicaciones.filter((p) => p.estado === 'publicado').length
  const borradores = publicaciones.filter((p) => p.estado === 'borrador').length

  return (
    <div className={estilos.gridMetricas}>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>Publicaciones</span>
        <span className={estilos.metricaValor}>{totalPublicaciones}</span>
      </div>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>Publicadas</span>
        <span className={`${estilos.metricaValor} ${estilos.colorVerde}`}>{publicadas}</span>
      </div>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>En borrador</span>
        <span className={`${estilos.metricaValor} ${estilos.colorAmbar}`}>{borradores}</span>
      </div>
    </div>
  )
}
