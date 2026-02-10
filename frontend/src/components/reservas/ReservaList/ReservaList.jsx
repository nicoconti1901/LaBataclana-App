import './ReservaList.css'

function ReservaList({ reservas = [] }) {
  return (
    <div className="reserva-list">
      <h2 className="reserva-list__title">Reservas</h2>
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
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="reserva-list__sorteo">{reserva.numero_sorteo}</td>
                  <td>{reserva.nombre}</td>
                  <td>{reserva.celular}</td>
                  <td>
                    <span className={`reserva-list__badge ${reserva.pago ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}>
                      {reserva.pago ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>{reserva.forma_pago || '-'}</td>
                  <td>{reserva.importe ? `$${reserva.importe}` : '-'}</td>
                  <td>
                    <span className={`reserva-list__badge ${reserva.consumicion ? 'reserva-list__badge--si' : 'reserva-list__badge--no'}`}>
                      {reserva.consumicion ? 'Sí' : 'No'}
                    </span>
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
