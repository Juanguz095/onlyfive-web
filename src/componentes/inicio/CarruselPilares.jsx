import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import estilos from './CarruselPilares.module.css'

const pilares = [
  {
    titulo: 'FORMACIÓN DE CALIDAD',
    descripcion: 'Contamos con docentes especializados y una malla curricular actualizada que responde a los estándares de la gastronomía moderna.',
    imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    alt: 'Formación de calidad',
  },
  {
    titulo: 'APRENDIZAJE PRÁCTICO',
    descripcion: 'Nuestros talleres equipados con tecnología de punta permiten a los estudiantes desarrollar habilidades reales desde el primer ciclo.',
    imagen: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
    alt: 'Aprendizaje práctico',
  },
  {
    titulo: 'DOCENTES ESPECIALIZADOS',
    descripcion: 'Chefs y profesionales con experiencia internacional acompañan cada etapa del proceso formativo de nuestros estudiantes.',
    imagen: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&q=80',
    alt: 'Docentes especializados',
  },
  {
    titulo: 'GASTRONOMÍA QUE INSPIRA',
    descripcion: 'Promovemos la identidad culinaria peruana e internacional, formando profesionales capaces de crear experiencias gastronómicas únicas.',
    imagen: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80',
    alt: 'Gastronomía que inspira',
  },
]

export default function CarruselPilares() {
  const [indiceActivo, setIndiceActivo] = useState(0)

  const anterior = () => setIndiceActivo((prev) => (prev === 0 ? pilares.length - 1 : prev - 1))
  const siguiente = () => setIndiceActivo((prev) => (prev === pilares.length - 1 ? 0 : prev + 1))

  // Mostrar 3 tarjetas visibles a la vez, la activa resaltada
  const tarjetasVisibles = [0, 1, 2].map((offset) => (indiceActivo + offset) % pilares.length)

  return (
    <section className={estilos.seccion}>
      <div className={estilos.gridCarrusel}>
        {tarjetasVisibles.map((idx, pos) => (
          <div
            key={idx}
            className={`${estilos.tarjeta} ${pos === 0 ? estilos.tarjetaActiva : ''}`}
          >
            <div className={estilos.imagenWrap}>
              <img src={pilares[idx].imagen} alt={pilares[idx].alt} className={estilos.imagen} />
            </div>
            <div className={estilos.contenidoTarjeta}>
              <h3 className={estilos.tituloTarjeta}>{pilares[idx].titulo}</h3>
              <p className={estilos.descripcionTarjeta}>{pilares[idx].descripcion}</p>
            </div>
          </div>
        ))}

        <div className={estilos.controles}>
          <button className={estilos.btnNav} onClick={anterior} aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <div className={estilos.indicadores}>
            {pilares.map((_, i) => (
              <button
                key={i}
                className={`${estilos.punto} ${i === indiceActivo ? estilos.puntoActivo : ''}`}
                onClick={() => setIndiceActivo(i)}
                aria-label={`Ir a tarjeta ${i + 1}`}
              />
            ))}
          </div>
          <button className={estilos.btnNav} onClick={siguiente} aria-label="Siguiente">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
