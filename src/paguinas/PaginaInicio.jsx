import Navbar from '../componentes/inicio/Navbar'
import Hero from '../componentes/inicio/Hero'
import CarruselPilares from '../componentes/inicio/CarruselPilares'
import SeccionInformacion from '../componentes/inicio/SeccionInformacion'
import SeccionArticulosRecientes from '../componentes/articulos/SeccionArticulosRecientes'
import SeccionActividades from '../componentes/inicio/SeccionActividades'
import SeccionChatbot from '../componentes/inicio/SeccionChatbot'
import Footer from '../componentes/inicio/Footer'
import estilos from './PaginaInicio.module.css'

export default function PaginaInicio() {
  return (
    <div className={estilos.pagina}>
      <Navbar />
      <Hero />
      <CarruselPilares />
      <SeccionInformacion />
      <SeccionArticulosRecientes />
      <SeccionActividades />
      <SeccionChatbot />
      <Footer />
    </div>
  )
}
