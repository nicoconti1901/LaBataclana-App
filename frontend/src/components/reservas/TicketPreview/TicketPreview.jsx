import './TicketPreview.css'

function TicketPreview({ reserva, eventoLugar, eventoFecha }) {
  return (
    <div className="ticket-preview">
      <div className="ticket-preview__header">
        <h3>Milonga Bataclana</h3>
      </div>
      {reserva ? (
        <div className="ticket-preview__body">
          <p><strong>Nombre:</strong> {reserva.nombre}</p>
          <p><strong>Lugar:</strong> {eventoLugar || 'Por confirmar'}</p>
          <p><strong>Fecha:</strong> {eventoFecha || 'Por confirmar'}</p>
          <p><strong>Celular:</strong> {reserva.celular}</p>
          <p className="ticket-preview__sorteo">
            <strong>N° Sorteo:</strong> 
            <span>{reserva.numero_sorteo}</span>
          </p>
          <p><strong>Pago:</strong> {reserva.pago ? 'Sí' : 'No'}</p>
          {reserva.forma_pago && <p><strong>Forma:</strong> {reserva.forma_pago}</p>}
          {reserva.importe && <p><strong>Importe:</strong> ${reserva.importe}</p>}
        </div>
      ) : (
        <p className="ticket-preview__empty">No hay datos de reserva</p>
      )}
    </div>
  )
}

export default TicketPreview
