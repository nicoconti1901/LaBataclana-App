import { Link } from 'react-router-dom'

function EventoCard({ evento }) {
  return (
    <div className="evento-card">
      <h3>{evento?.nombre || 'Evento'}</h3>
      <p>{evento?.descripcion || 'Descripción del evento'}</p>
      <Link to={`/eventos/${evento?.id || 1}`}>Ver detalles</Link>
    </div>
  )
}

export default EventoCard
