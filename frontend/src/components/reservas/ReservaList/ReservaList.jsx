import { useState } from 'react'
import EntradaDigitalModal from '../EntradaDigital/EntradaDigitalModal'
import './ReservaList.css'

function ReservaList({ reservas = [], evento, onTogglePago, onToggleConsumicion }) {
  const [entradaReserva, setEntradaReserva] = useState(null)
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
                <th>Enviar</th>
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
                    <button
                      type="button"
                      className="reserva-list__whatsapp"
                      onClick={() => setEntradaReserva(reserva)}
                      title="Enviar entrada por WhatsApp con imagen"
                    >
                      Enviar por WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {entradaReserva && (
        <EntradaDigitalModal
          reserva={entradaReserva}
          evento={evento}
          onClose={() => setEntradaReserva(null)}
        />
      )}
    </div>
  )
}

export default ReservaList
