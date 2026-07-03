import { useState } from 'react'
import estilos from './FormularioLogin.module.css'

export default function FormularioLogin({ alEnviar }) {
  const [correo, setCorreo] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false)
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (!correo || !contrasenia) return
    setCargando(true)
    setTimeout(() => setCargando(false), 1500)
    if (alEnviar) alEnviar({ correo, contrasenia })
  }

  return (
    <form className={estilos.formulario} onSubmit={manejarEnvio}>
      <div className={estilos.campoGrupo}>
        <label className={estilos.etiqueta} htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          className={estilos.campo}
          placeholder="tu@correo.edu.pe"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>

      <div className={estilos.campoGrupo}>
        <div className={estilos.etiquetaFila}>
          <label className={estilos.etiqueta} htmlFor="contrasenia">Contraseña</label>
          <button type="button" className={estilos.linkOlvide}>¿Olvidaste tu contraseña?</button>
        </div>
        <div className={estilos.campoContrasenia}>
          <input
            id="contrasenia"
            type={mostrarContrasenia ? 'text' : 'password'}
            className={estilos.campo}
            placeholder="••••••••"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
          <button
            type="button"
            className={estilos.btnMostrar}
            onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
            aria-label={mostrarContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarContrasenia ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={`${estilos.btnIngresar} ${cargando ? estilos.btnCargando : ''}`}
        disabled={cargando}
      >
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}