import { Link } from 'react-router-dom'
import './EventoCard.css'

function EventoCard({ evento }) {
  const fechaFormateada = evento?.fecha
    ? new Date(evento.fecha).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Fecha por confirmar'

  return (
    <div className={`evento-card ${evento?.estado === 'inactivo' ? 'evento-card--inactivo' : ''}`}>
      <div className="evento-card__header">
        <span className={`evento-card__estado evento-card__estado--${evento?.estado || 'activo'}`}>
          {evento?.estado || 'activo'}
        </span>
      </div>
      <div className="evento-card__body">
        <h3 className="evento-card__lugar">{evento?.lugar || 'Lugar por confirmar'}</h3>
        {evento?.direccion && (
          <p className="evento-card__direccion">{evento.direccion}</p>
        )}
        <p className="evento-card__fecha">{fechaFormateada}</p>
      </div>
      <div className="evento-card__footer">
        <Link to={`/eventos/${evento?.id}`} className="evento-card__link">
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

export default EventoCard
