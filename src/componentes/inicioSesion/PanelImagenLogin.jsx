import estilos from './PanelImagenLogin.module.css'

export default function PanelImagenLogin() {
  return (
    <div className={estilos.panelIzquierdo}>
      <div className={estilos.contenidoPanel}>
        <div className={estilos.logoBloque}>
          <span className={estilos.logoNombre}>I.E.S.P. Simón Bolívar</span>
          <span className={estilos.logoSub}>PROGRAMA DE ESTUDIOS DE COCINA</span>
        </div>
        <div className={estilos.cita}>
          <p className={estilos.citaTexto}>"Formamos talento, creamos experiencias"</p>
        </div>
      </div>
      <div className={estilos.imagenOverlay} />
      <img
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"
        alt="Cocina"
        className={estilos.imagenFondo}
      />
    </div>
  )
}