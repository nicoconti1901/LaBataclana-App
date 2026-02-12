import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BotonPrincipal, PageLayout } from '../components'
import { eventosService } from '../services/eventosService'
import { getEstadoFromFecha } from '../utils/eventoUtils'
import './EventoDetalle.css'

function EventoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await eventosService.getById(id)
        setEvento(data)
      } catch {
        setError('No se pudo cargar el evento')
      } finally {
        setLoading(false)
      }
    }
    fetchEvento()
  }, [id])

  const formatFecha = (fecha) => {
    if (!fecha) return 'Por confirmar'
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estado = getEstadoFromFecha(evento?.fecha)

  if (loading) {
    return (
      <PageLayout>
        <p className="evento-detalle__loading">Cargando...</p>
      </PageLayout>
    )
  }

  if (error || !evento) {
    return (
      <PageLayout>
        <div className="evento-detalle">
          <div className="evento-detalle__card">
            <p className="evento-detalle__error">{error || 'Evento no encontrado'}</p>
            <BotonPrincipal variant="secondary" onClick={() => navigate('/')}>
              Volver al inicio
            </BotonPrincipal>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="evento-detalle">
        <div className="evento-detalle__card">
          <button className="evento-detalle__back" onClick={() => navigate('/')}>
            ← Inicio
          </button>

          <div className="evento-detalle__header">
            <span className={`evento-detalle__estado evento-detalle__estado--${estado.toLowerCase()}`}>
              {estado}
            </span>
          </div>

          <h2 className="evento-detalle__lugar">{evento.lugar}</h2>
          {evento.direccion && (
            <p className="evento-detalle__direccion">{evento.direccion}</p>
          )}
          <p className="evento-detalle__fecha">{formatFecha(evento.fecha)}</p>

          <div className="evento-detalle__separator"></div>

          <div className="evento-detalle__actions">
            <BotonPrincipal
              variant="primary"
              onClick={() => navigate(`/eventos/${id}/reservas`)}
            >
              Mis Reservas
            </BotonPrincipal>
            <BotonPrincipal
              variant="secondary"
              onClick={() => navigate(`/eventos/${id}/finanzas`)}
            >
              Gastos / Ganancias
            </BotonPrincipal>
            <BotonPrincipal
              variant="secondary"
              onClick={() => navigate('/eventos')}
            >
              Mis Eventos
            </BotonPrincipal>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventoDetalle
