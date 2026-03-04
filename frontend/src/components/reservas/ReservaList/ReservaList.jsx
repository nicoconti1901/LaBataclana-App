import { useState } from 'react'
import EntradaDigitalModal from '../EntradaDigital/EntradaDigitalModal'
import { reservasService } from '../../../services/reservasService'
import './ReservaList.css'

function ReservaList({ reservas = [], evento, onTogglePago, onToggleConsumicion, onEntradaEnviada, onDelete }) {
  const [entradaReserva, setEntradaReserva] = useState(null)
  const [ingresos, setIngresos] = useState(() => new Set())
  const [entradasEnviadas, setEntradasEnviadas] = useState(() => new Set())

  const toggleIngreso = (id) => {
    setIngresos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleRowDoubleClick = (e, reserva) => {
    if (e.target.closest('button')) return
    toggleIngreso(reserva.id)
  }

  const handleDelete = (e, reserva) => {
    e.stopPropagation()
    if (!onDelete) return
    if (window.confirm(`¿Eliminar la reserva de ${reserva.nombre}?`)) {
      onDelete(reserva)
    }
  }

  const reservasIngreso = reservas.filter((r) => ingresos.has(r.id))
  const reservasNoIngreso = reservas.filter((r) => !ingresos.has(r.id))

  const estaEnviado = (r) => !!r.entrada_enviada || entradasEnviadas.has(r.id)

  const renderFila = (reserva) => (
    <tr
      key={reserva.id}
      className={`reserva-list__row reserva-list__row--${ingresos.has(reserva.id) ? 'ingreso' : 'no-ingreso'}`}
      onDoubleClick={(e) => handleRowDoubleClick(e, reserva)}
      title="Doble clic para mover entre Ingreso / No ingreso"
    >
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
          className={`reserva-list__whatsapp ${estaEnviado(reserva) ? 'reserva-list__whatsapp--enviado' : ''}`}
          onClick={() => setEntradaReserva(reserva)}
          title={estaEnviado(reserva) ? 'Reenviar entrada por WhatsApp' : 'Enviar entrada por WhatsApp con imagen'}
        >
          {estaEnviado(reserva) ? '✓ Enviado' : 'Enviar por WhatsApp'}
        </button>
      </td>
      {onDelete && (
        <td className="reserva-list__delete-cell">
          <button
            type="button"
            className="reserva-list__delete"
            onClick={(e) => handleDelete(e, reserva)}
            title="Eliminar reserva"
            aria-label="Eliminar reserva"
          >
            ×
          </button>
        </td>
      )}
    </tr>
  )

  if (reservas.length === 0) {
    return (
      <div className="reserva-list">
        <p className="reserva-list__empty">No hay reservas</p>
      </div>
    )
  }

  return (
    <div className="reserva-list">
      <div className="reserva-list__sections">
        <div className="reserva-list__section">
          <h4 className="reserva-list__section-title reserva-list__section-title--ingreso">
            Ingresó ({reservasIngreso.length})
          </h4>
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
                  {onDelete && <th className="reserva-list__delete-cell"></th>}
                </tr>
              </thead>
              <tbody>
                {reservasIngreso.map(renderFila)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="reserva-list__section">
          <h4 className="reserva-list__section-title reserva-list__section-title--no-ingreso">
            No Ingresó ({reservasNoIngreso.length})
          </h4>
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
                  {onDelete && <th className="reserva-list__delete-cell"></th>}
                </tr>
              </thead>
              <tbody>
                {reservasNoIngreso.map(renderFila)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {entradaReserva && (
        <EntradaDigitalModal
          reserva={entradaReserva}
          evento={evento}
          yaEnviado={estaEnviado(entradaReserva)}
          onEnviado={async () => {
            try {
              await reservasService.marcarEntradaEnviada(entradaReserva.id)
              setEntradasEnviadas((prev) => new Set([...prev, entradaReserva.id]))
              onEntradaEnviada?.()
            } catch (err) {
              setEntradasEnviadas((prev) => new Set([...prev, entradaReserva.id]))
              onEntradaEnviada?.()
              console.error(err)
            }
          }}
          onClose={() => setEntradaReserva(null)}
        />
      )}
    </div>
  )
}

export default ReservaList
