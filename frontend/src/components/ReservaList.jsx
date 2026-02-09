function ReservaList({ reservas = [] }) {
  return (
    <div className="reserva-list">
      <h2>Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <p>Nombre: {reserva.nombre}</p>
              <p>Email: {reserva.email}</p>
              <p>Cantidad: {reserva.cantidad}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReservaList
