import { useState } from 'react'
import { Send, ChevronRight, Bot } from 'lucide-react'
import estilos from './SeccionChatbot.module.css'

const respuestasRapidas = [
  'Información de la carrera',
  'Próximas actividades',
  'Requisitos de admisión',
  'Horarios y talleres',
]

export default function SeccionChatbot() {
  const [mensajeInput, setMensajeInput] = useState('')
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: '¡Hola! Soy ChefBot IA, tu asistente virtual del Programa de Cocina. ¿En qué puedo ayudarte hoy?',
    },
  ])

  const enviarMensaje = (texto) => {
    if (!texto.trim()) return
    setMensajes((prev) => [...prev, { tipo: 'usuario', texto }])
    setMensajeInput('')
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        { tipo: 'bot', texto: 'Gracias por tu consulta. Un momento, estoy buscando la información para ti...' },
      ])
    }, 800)
  }

  return (
    <section className={estilos.seccion}>
      <div className={estilos.bannerLateral}>
        <h2 className={estilos.bannerTitulo}>
          FORMAMOS TALENTO, CREAMOS EXPERIENCIAS
        </h2>
        <button className={estilos.bannerBtn}>CONOCE MÁS</button>
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
                <span className={estilos.puntoverde} /> En línea
              </div>
            </div>
          </div>

          <div className={estilos.chatMensajes}>
            {mensajes.map((m, i) => (
              <div
                key={i}
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
            />
            <button
              className={estilos.btnEnviar}
              onClick={() => enviarMensaje(mensajeInput)}
              aria-label="Enviar"
            >
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
