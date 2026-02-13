import './ReservaList.css'

function formatWhatsAppUrl(celular) {
  if (!celular) return null
  let digits = String(celular).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('15') && digits.length === 11) digits = digits.slice(2)
  const numero = digits.startsWith('54') && digits.length >= 12 ? digits : `549${digits.slice(-10)}`
  return `https://wa.me/${numero}`
}

function ReservaList({ reservas = [], onTogglePago, onToggleConsumicion }) {
  return (
    <div className="reserva-list">
      {reservas.length === 0 ? (
        <p className="reserva-list__empty">No hay reservas</p>
      ) : (
        <div className="reserva-list__table-wrapper">
          <table className="reserva-list__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Celular</th>
                <th>Pago</th>
                <th>Forma</th>
                <th>Importe</th>
                <th>Consumición</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="reserva-list__sorteo">{reserva.numero_sorteo}</td>
                  <td>{reserva.nombre}</td>
                  <td>{reserva.celular}</td>
                  <td>
                    {onTogglePago ? (
                      <button
                        type="button"
                        className={`reserva-list__badge reserva-list__badge--clickable ${reserva.pago ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}
                        onClick={() => onTogglePago(reserva)}
                        title="Clic para cambiar"
                      >
                        {reserva.pago ? 'Sí' : 'No'}
                      </button>
                    ) : (
                      <span className={`reserva-list__badge ${reserva.pago ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}>
                        {reserva.pago ? 'Sí' : 'No'}
                      </span>
                    )}
                  </td>
                  <td>{reserva.forma_pago || '-'}</td>
                  <td>{reserva.importe ? `$${reserva.importe}` : '-'}</td>
                  <td>
                    {onToggleConsumicion ? (
                      <button
                        type="button"
                        className={`reserva-list__badge reserva-list__badge--clickable ${reserva.consumicion ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}
                        onClick={() => onToggleConsumicion(reserva)}
                        title="Clic para cambiar"
                      >
                        {reserva.consumicion ? 'Sí' : 'No'}
                      </button>
                    ) : (
                      <span className={`reserva-list__badge ${reserva.consumicion ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}>
                        {reserva.consumicion ? 'Sí' : 'No'}
                      </span>
                    )}
                  </td>
                  <td>
                    {reserva.celular ? (
                      <a
                        href={formatWhatsAppUrl(reserva.celular)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserva-list__whatsapp"
                        title="Enviar mensaje por WhatsApp"
                      >
                        Enviar mensaje
                      </a>
                    ) : (
                      <span className="reserva-list__empty-cell">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ReservaList
