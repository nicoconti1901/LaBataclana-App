import { useState } from 'react'

function ReservaForm({ eventoId, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cantidad: 1
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...formData, eventoId })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={formData.cantidad}
        onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
        min="1"
        required
      />
      <button type="submit">Reservar</button>
    </form>
  )
}

export default ReservaForm
