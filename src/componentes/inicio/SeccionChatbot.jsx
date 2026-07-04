import { useState } from 'react'
import { Send, ChevronRight, Bot } from 'lucide-react'
import estilos from './SeccionChatbot.module.css'

const respuestasRapidas = [
  'Informacion de la carrera',
  'Proximas actividades',
  'Requisitos de admision',
  'Horarios y talleres',
]

export default function SeccionChatbot() {
  const [mensajeInput, setMensajeInput] = useState('')
  const [conversacionId, setConversacionId] = useState(() => localStorage.getItem('conversacionChatId'))
  const [cargando, setCargando] = useState(false)
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: 'Hola! Soy ChefBot IA, tu asistente virtual del Programa de Cocina. En que puedo ayudarte hoy?',
    },
  ])

  const enviarMensaje = async (texto) => {
    const consulta = texto.trim()
    if (!consulta || cargando) return

    setMensajes((prev) => [...prev, { tipo: 'usuario', texto: consulta }])
    setMensajeInput('')
    setCargando(true)

    try {
      const respuesta = await fetch('http://localhost:1337/api/chatbot/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: consulta,
          conversacionId,
        }),
      })
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error('No se pudo responder')
      }

      if (datos.conversacionId) {
        setConversacionId(datos.conversacionId)
        localStorage.setItem('conversacionChatId', datos.conversacionId)
      }

      setMensajes((prev) => [...prev, datos.mensaje])
    } catch {
      setMensajes((prev) => [
        ...prev,
        { tipo: 'bot', texto: 'No pude conectarme con el asistente. Verifica que Strapi este iniciado.' },
      ])
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className={estilos.seccion}>
      <div className={estilos.bannerLateral}>
        <h2 className={estilos.bannerTitulo}>
          FORMAMOS TALENTO, CREAMOS EXPERIENCIAS
        </h2>
        <button className={estilos.bannerBtn}>CONOCE MAS</button>
      </div>

      <div className={estilos.chatbotBloque}>
        <div className={estilos.encabezadoBloque}>
          <h3 className={estilos.tituloBloque}>ASISTENTE VIRTUAL</h3>
        </div>

        <div className={estilos.chatCard}>
          <div className={estilos.chatHead}>
            <div className={estilos.chatAvatar}>
              <Bot size={20} color="#4361ee" />
            </div>
            <div>
              <div className={estilos.chatNombre}>ChefBot IA</div>
              <div className={estilos.chatEstado}>
                <span className={estilos.puntoverde} /> En linea
              </div>
            </div>
          </div>

          <div className={estilos.chatMensajes}>
            {mensajes.map((m, i) => (
              <div
                key={`${m.tipo}-${i}`}
                className={m.tipo === 'bot' ? estilos.burbujabBot : estilos.burbujaUsuario}
              >
                {m.texto}
              </div>
            ))}

            {mensajes.length === 1 && (
              <div className={estilos.respuestasRapidas}>
                {respuestasRapidas.map((r) => (
                  <button
                    key={r}
                    className={estilos.chipRespuesta}
                    onClick={() => enviarMensaje(r)}
                    disabled={cargando}
                  >
                    <span>{r}</span>
                    <ChevronRight size={13} color="#aaa" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={estilos.chatInput}>
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              value={mensajeInput}
              onChange={(e) => setMensajeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje(mensajeInput)}
              className={estilos.inputTexto}
              disabled={cargando}
            />
            <button
              className={estilos.btnEnviar}
              onClick={() => enviarMensaje(mensajeInput)}
              aria-label="Enviar"
              disabled={cargando}
            >
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
