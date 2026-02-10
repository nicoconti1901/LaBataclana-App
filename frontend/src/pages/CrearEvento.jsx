import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BotonPrincipal } from '../components'
import { eventosService } from '../services/eventosService'
import './CrearEvento.css'

function CrearEvento() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    lugar: '',
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
      await eventosService.create({
        lugar: formData.lugar,
        fecha: formData.fecha,
        estado: 'activo'
      })
      navigate('/eventos')
    } catch (err) {
      setError(err.message || 'Error al crear el evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crear-evento">
      <div className="crear-evento__card">
        <button className="crear-evento__back" onClick={() => navigate('/')}>
          ← Volver
        </button>

        <h2 className="crear-evento__title">Nuevo Evento</h2>
        <p className="crear-evento__subtitle">Completá los datos para crear un evento</p>

        <div className="crear-evento__separator"></div>

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
              placeholder="Ej: Salón El Abrazo, CABA"
              value={formData.lugar}
              onChange={handleChange}
              required
              autoFocus
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
      </div>
    </div>
  )
}

export default CrearEvento
