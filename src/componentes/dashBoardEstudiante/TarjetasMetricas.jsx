import estilos from './TarjetasMetricas.module.css'

export default function TarjetasMetricas({ publicaciones, publicadas, borradores, visitas }) {
  return (
    <div className={estilos.gridMetricas}>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>Publicaciones</span>
        <span className={estilos.metricaValor}>{publicaciones}</span>
      </div>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>Publicadas</span>
        <span className={`${estilos.metricaValor} ${estilos.colorVerde}`}>{publicadas}</span>
      </div>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>En borrador</span>
        <span className={`${estilos.metricaValor} ${estilos.colorAmbar}`}>{borradores}</span>
      </div>
      <div className={estilos.tarjetaMetrica}>
        <span className={estilos.metricaLabel}>Visitas totales</span>
        <span className={estilos.metricaValor}>{visitas}</span>
      </div>
    </div>
  )
}