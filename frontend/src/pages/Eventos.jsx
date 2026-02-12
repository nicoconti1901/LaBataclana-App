import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { PageLayout, EventoCard, BotonPrincipal } from '../components'
import { eventosService } from '../services/eventosService'
import { esEventoActivo } from '../utils/eventoUtils'
import imagenEventos from '../assets/—Pngtree—latin dancing feet bygema ibarra_10757310.jpg'
import './Eventos.css'

const tangoSpring = { type: 'spring', stiffness: 70, damping: 14 }

function Eventos() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventosService.getAll()
        // Ordenar: Activos primero (fecha desc), luego Finalizados (fecha desc)
        const sorted = [...data].sort((a, b) => {
          const aActivo = esEventoActivo(a.fecha) ? 1 : 0
          const bActivo = esEventoActivo(b.fecha) ? 1 : 0
          if (aActivo !== bActivo) return bActivo - aActivo
          return new Date(b.fecha) - new Date(a.fecha)
        })
        setEventos(sorted)
      } catch {
        setError('No se pudieron cargar los eventos')
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  const count = eventos.length
  const gridClass = count <= 2 ? 'eventos-grid--few' : count <= 4 ? 'eventos-grid--medium' : 'eventos-grid--many'

  if (loading) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <div className="eventos">
          <Motion.p
            className="eventos__loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Cargando eventos...
          </Motion.p>
          <Motion.div
            className="eventos__loading-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>•</Motion.span>
            <Motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>•</Motion.span>
            <Motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>•</Motion.span>
          </Motion.div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <div className="eventos">
          <p className="eventos__error">{error}</p>
          <BotonPrincipal variant="secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </BotonPrincipal>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout backgroundImage={imagenEventos}>
      <div className="eventos">
        <button className="eventos__back" onClick={() => navigate('/')}>
          ← Inicio
        </button>
        <button className="eventos__new" onClick={() => navigate('/crear-evento')}>
          + Nuevo evento
        </button>

        <Motion.header
          className="eventos__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...tangoSpring, delay: 0.1 }}
        >
          <h1 className="eventos__title">Mis Eventos</h1>
          <p className="eventos__subtitle">
            Administracion de mis milongas con los detalles de cada una
          </p>
        </Motion.header>

        {eventos.length === 0 ? (
          <Motion.div
            className="eventos__empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={tangoSpring}
          >
            <p>No hay eventos creados</p>
            <BotonPrincipal variant="primary" onClick={() => navigate('/crear-evento')}>
              Crear primer evento
            </BotonPrincipal>
          </Motion.div>
        ) : (
          <Motion.div
            className={`eventos-grid ${gridClass}`}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              hidden: {}
            }}
          >
            {eventos.map((evento) => (
              <Motion.div
                key={evento.id}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={tangoSpring}
              >
                <EventoCard evento={evento} />
              </Motion.div>
            ))}
          </Motion.div>
        )}
      </div>
    </PageLayout>
  )
}

export default Eventos
