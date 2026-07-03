import estilos from './InfoNuevoUsuario.module.css'

export default function InfoNuevoUsuario() {
  return (
    <div className={estilos.rolBloque}>
      <p className={estilos.rolTexto}>¿Eres nuevo en la plataforma?</p>
      <p className={estilos.rolDescripcion}>
        Contacta al coordinador del programa para obtener acceso como estudiante o docente.
      </p>
    </div>
  )
}