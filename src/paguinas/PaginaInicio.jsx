import Navbar from '../componentes/inicio/Navbar'
import Hero from '../componentes/inicio/Hero'
import CarruselPilares from '../componentes/inicio/CarruselPilares'
import SeccionActividades from '../componentes/inicio/SeccionActividades'
import SeccionChatbot from '../componentes/inicio/SeccionChatbot'
import Footer from '../componentes/inicio/Footer'

export default function PaginaInicio() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <Hero />
      <CarruselPilares />
      <SeccionActividades />
      <SeccionChatbot />
      <Footer />
    </div>
  )
}