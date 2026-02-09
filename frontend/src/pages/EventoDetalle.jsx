import { useParams } from 'react-router-dom'

function EventoDetalle() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>Detalle del Evento</h1>
      <p>ID del evento: {id}</p>
    </div>
  )
}

export default EventoDetalle
