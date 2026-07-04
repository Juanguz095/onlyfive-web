import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import estilos from './FormularioLogin.module.css'

export default function FormularioLogin({ alEnviar }) {
  const navegar = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    if (!correo || !contrasenia) return

    setCargando(true)
    setError('')

    try {
      const respuesta = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: correo,
          password: contrasenia,
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos.jwt) {
        throw new Error(datos?.error?.message || 'No se pudo iniciar sesion')
      }

      localStorage.setItem('jwt', datos.jwt)
      if (alEnviar) alEnviar({ correo, contrasenia })
      navegar('/dashboard')
    } catch (errorPeticion) {
      setError(errorPeticion.message || 'Correo o contrasenia incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form className={estilos.formulario} onSubmit={manejarEnvio}>
      <div className={estilos.campoGrupo}>
        <label className={estilos.etiqueta} htmlFor="correo">Correo electronico</label>
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
          <label className={estilos.etiqueta} htmlFor="contrasenia">Contrasenia</label>
          <button type="button" className={estilos.linkOlvide}>Olvidaste tu contrasenia?</button>
        </div>
        <div className={estilos.campoContrasenia}>
          <input
            id="contrasenia"
            type={mostrarContrasenia ? 'text' : 'password'}
            className={estilos.campo}
            placeholder="********"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
          <button
            type="button"
            className={estilos.btnMostrar}
            onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
            aria-label={mostrarContrasenia ? 'Ocultar contrasenia' : 'Mostrar contrasenia'}
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
      {error && (
        <p style={{ margin: 0, fontSize: '12px', color: '#dc2626', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </form>
  )
}
