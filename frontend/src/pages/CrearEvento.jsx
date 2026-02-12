import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BotonPrincipal, PageLayout } from '../components'
import { eventosService } from '../services/eventosService'
import './CrearEvento.css'

const tangoSpring = { type: 'spring', stiffness: 65, damping: 15 }

function CrearEvento() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    lugar: '',
    direccion: '',
    fecha: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const evento = await eventosService.create({
        lugar: formData.lugar,
        direccion: formData.direccion,
        fecha: formData.fecha,
        estado: 'activo'
      })
      navigate(`/eventos/${evento.id}`)
    } catch (err) {
      setError(err.message || 'Error al crear el evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="crear-evento">
        <motion.div
          className="crear-evento__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tangoSpring}
        >
        <button className="crear-evento__back" onClick={() => navigate('/')}>
          ← Volver
        </button>

        <motion.h2
          className="crear-evento__title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Nuevo Evento
        </motion.h2>
        <motion.p
          className="crear-evento__subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Completá los datos para crear un evento
        </motion.p>

        <motion.div
          className="crear-evento__separator"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...tangoSpring, delay: 0.25 }}
          style={{ transformOrigin: 'left' }}
        ></motion.div>

        {error && (
          <p className="crear-evento__error">{error}</p>
        )}

        <form className="crear-evento__form" onSubmit={handleSubmit}>
          <div className="crear-evento__field">
            <label htmlFor="lugar">Lugar</label>
            <input
              id="lugar"
              name="lugar"
              type="text"
              placeholder="Ej: Salón El Abrazo"
              value={formData.lugar}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="crear-evento__field">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Ej: Av. Corrientes 1234, CABA"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="crear-evento__field">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="crear-evento__actions">
            <BotonPrincipal
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </BotonPrincipal>
            <BotonPrincipal
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </BotonPrincipal>
          </div>
        </form>
        </motion.div>
      </div>
    </PageLayout>
  )
}

export default CrearEvento
