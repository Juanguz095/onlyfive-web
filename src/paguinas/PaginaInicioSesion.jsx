import PanelImagenLogin from '../componentes/inicioSesion/PanelImagenLogin'
import FormularioLogin from '../componentes/inicioSesion/FormularioLogin'
import InfoNuevoUsuario from '../componentes/inicioSesion/InfoNuevoUsuario'

export default function PaginaInicioSesion() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <PanelImagenLogin />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', borderLeft: '1px solid #e8e8e8' }}>
        <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Iniciar sesión</h1>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>Ingresa tus credenciales para continuar</p>
          </div>
          <FormularioLogin />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
            <span style={{ fontSize: '12px', color: '#bbb' }}>o</span>
            <span style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
          </div>
          <InfoNuevoUsuario />
          <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>← Volver al inicio</a>
        </div>
      </div>
    </div>
  )
}