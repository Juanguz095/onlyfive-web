import { Mail, Phone } from 'lucide-react'
import estilos from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={estilos.footer}>
      <div className={estilos.marca}>
        <span className={estilos.nombre}>I.E.S.P. Simon Bolivar</span>
        <span className={estilos.programa}>Programa de Estudios de Cocina</span>
      </div>

      <div className={estilos.contacto}>
        <span className={estilos.item}>
          <Mail size={13} />
          cocina@iespsb.edu.pe
        </span>
        <span className={estilos.item}>
          <Phone size={13} />
          (01) 123 4567
        </span>
      </div>

      <span className={estilos.copy}>2026</span>
    </footer>
  )
}
