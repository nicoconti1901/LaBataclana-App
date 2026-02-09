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

  async create(reserva) {
    const response = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reserva),
    })
    if (!response.ok) throw new Error('Error al crear reserva')
    return response.json()
  },

  async getByEventoId(eventoId) {
    const response = await fetch(`${API_URL}/reservas/evento/${eventoId}`)
    if (!response.ok) throw new Error('Error al obtener reservas del evento')
    return response.json()
  },
}
