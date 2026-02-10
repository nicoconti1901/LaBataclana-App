const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const reservasService = {
  async getAll() {
    const response = await fetch(`${API_URL}/reservas`)
    if (!response.ok) throw new Error('Error al obtener reservas')
    return response.json()
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/reservas/${id}`)
    if (!response.ok) throw new Error('Error al obtener reserva')
    return response.json()
  },

  async getByEventoId(eventoId) {
    const response = await fetch(`${API_URL}/reservas/evento/${eventoId}`)
    if (!response.ok) throw new Error('Error al obtener reservas del evento')
    return response.json()
  },

  async create({ nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo, evento_id }) {
    const response = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo, evento_id }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al crear reserva')
    }
    return response.json()
  },

  async update(id, { nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo }) {
    const response = await fetch(`${API_URL}/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al actualizar reserva')
    }
    return response.json()
  },

  async actualizarPago(id, { pago, forma_pago, importe }) {
    const response = await fetch(`${API_URL}/reservas/${id}/pago`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pago, forma_pago, importe }),
    })
    if (!response.ok) throw new Error('Error al actualizar pago')
    return response.json()
  },

  async actualizarConsumicion(id, consumicion) {
    const response = await fetch(`${API_URL}/reservas/${id}/consumicion`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consumicion }),
    })
    if (!response.ok) throw new Error('Error al actualizar consumición')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/reservas/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar reserva')
    return response.json()
  },
}
