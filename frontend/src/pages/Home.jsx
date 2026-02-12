import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BotonPrincipal, Footer } from '../components'
import imagenFondo from '../assets/imagen-fondo.jpg'
import './Home.css'

const tangoSpring = { type: 'spring', stiffness: 60, damping: 14 }
const staggerDelay = 0.15
const buttonVariants = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div 
        className="home-background"
        style={{ backgroundImage: `url(${imagenFondo})` }}
      >
        <div className="home-overlay"></div>
        <motion.h2
          className="home-logo-text"
          initial={{ opacity: 0, y: 30, rotate: 15 }}
          animate={{ opacity: 1, y: 0, rotate: 20 }}
          transition={{ ...tangoSpring, delay: 0.2 }}
        >
          <motion.span
            className="logo-milonga"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...tangoSpring, delay: 0.5 }}
          >
            Milonga
          </motion.span>
          <motion.span
            className="logo-bataclana"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...tangoSpring, delay: 0.65 }}
          >
            Bataclana
          </motion.span>
        </motion.h2>
        <div className="home-content">
          <motion.div
            className="home-buttons"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: staggerDelay } },
              hidden: {}
            }}
          >
            <motion.div variants={buttonVariants} transition={tangoSpring}>
              <BotonPrincipal 
                variant="primary"
                onClick={() => navigate('/crear-evento')}
              >
                Crear Evento
              </BotonPrincipal>
            </motion.div>
            <motion.div variants={buttonVariants} transition={tangoSpring}>
              <BotonPrincipal 
                variant="secondary"
                onClick={() => navigate('/eventos')}
              >
                Ver Eventos
              </BotonPrincipal>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
