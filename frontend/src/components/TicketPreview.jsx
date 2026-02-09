function TicketPreview({ reserva }) {
  return (
    <div className="ticket-preview">
      <h3>Vista Previa del Ticket</h3>
      {reserva ? (
        <div>
          <p><strong>Nombre:</strong> {reserva.nombre}</p>
          <p><strong>Evento:</strong> {reserva.eventoNombre || 'Evento'}</p>
          <p><strong>Cantidad:</strong> {reserva.cantidad}</p>
          <p><strong>Código:</strong> {reserva.codigo || 'N/A'}</p>
        </div>
      ) : (
        <p>No hay datos de reserva</p>
      )}
    </div>
  )
}

export default TicketPreview
