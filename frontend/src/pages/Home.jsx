import { useNavigate } from 'react-router-dom'
import { BotonPrincipal, Footer } from '../components'
import imagenFondo from '../assets/imagen-fondo.jpg'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div 
        className="home-background"
        style={{ backgroundImage: `url(${imagenFondo})` }}
      >
        <div className="home-overlay"></div>
        <h2 className="home-logo-text">
          <span className="logo-milonga">Milonga</span>
          <span className="logo-bataclana">Bataclana</span>
        </h2>
        <div className="home-content">
          <div className="home-buttons">
            <BotonPrincipal 
              variant="primary"
              onClick={() => navigate('/crear-evento')}
            >
              Crear Evento
            </BotonPrincipal>
            <BotonPrincipal 
              variant="secondary"
              onClick={() => navigate('/eventos')}
            >
              Ver Eventos
            </BotonPrincipal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
