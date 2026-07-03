import { MapPin, Mail, Phone } from 'lucide-react'
import estilos from './Footer.module.css'

const enlacesRapidos = [
  'Inicio',
  'Actividades realizadas',
  'Logros',
  'Galería',
  'Contáctanos',
]

const horarios = [
  { dia: 'Lun – Vie', hora: '8:00 – 18:00' },
  { dia: 'Sábados', hora: '8:00 – 13:00' },
  { dia: 'Domingos', hora: 'Cerrado' },
  { dia: 'Feriados', hora: '8:00 – 12:00' },
]

export default function Footer() {
  return (
    <footer className={estilos.footer}>
      <div className={estilos.gridPrincipal}>

        <div className={estilos.columnaInstituto}>
          <div className={estilos.logoFooter}>
            <span className={estilos.logoNombre}>I.E.S.P. Simón Bolívar</span>
            <span className={estilos.logoPrograma}>PROGRAMA DE ESTUDIOS DE COCINA</span>
          </div>
          <p className={estilos.descripcionInstituto}>
            Formamos profesionales con pasión, creatividad y compromiso con la gastronomía peruana e internacional.
          </p>
          <div className={estilos.contactoList}>
            <div className={estilos.contactoFila}>
              <MapPin size={13} color="#888" />
              <span>Av. Simón Bolívar s/n, Bellavista, Callao</span>
            </div>
            <div className={estilos.contactoFila}>
              <Mail size={13} color="#888" />
              <span>cocina@iespsb.edu.pe</span>
            </div>
            <div className={estilos.contactoFila}>
              <Phone size={13} color="#888" />
              <span>(01) 123 4567</span>
            </div>
          </div>
        </div>

        <div className={estilos.columna}>
          <h4 className={estilos.columnaTitle}>ENLACES RÁPIDOS</h4>
          <ul className={estilos.listaEnlaces}>
            {enlacesRapidos.map((e) => (
              <li key={e}>
                <a href="#" className={estilos.enlace}>{e}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={estilos.columna}>
          <h4 className={estilos.columnaTitle}>HORARIOS DE ATENCIÓN</h4>
          <div className={estilos.tablaHorarios}>
            {horarios.map((h) => (
              <div key={h.dia} className={estilos.filaHorario}>
                <span className={estilos.horarioDia}>{h.dia}</span>
                <span className={estilos.horarioHora}>{h.hora}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={estilos.columna}>
          <h4 className={estilos.columnaTitle}>REDES SOCIALES</h4>
          <div className={estilos.redesGrid}>
            <a href="#" className={estilos.redBtn} aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className={estilos.redBtn} aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className={estilos.redBtn} aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
            <a href="#" className={estilos.redBtn} aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
          <p className={estilos.redTexto}>Síguenos para ver los logros, recetas y eventos de nuestros estudiantes.</p>
        </div>

      </div>

      <div className={estilos.barraFinal}>
        <span>© 2026 I.E.S.P. Simón Bolívar — Programa de Estudios de Cocina. Todos los derechos reservados.</span>
        <div className={estilos.politicas}>
          <a href="#">Política de privacidad</a>
          <span className={estilos.sepPolitica}>·</span>
          <a href="#">Términos y condiciones</a>
        </div>
      </div>
    </footer>
  )
}
