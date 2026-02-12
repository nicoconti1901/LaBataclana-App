const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const gastosService = {
  async getByEventoId(eventoId) {
    const response = await fetch(`${API_URL}/gastos/evento/${eventoId}`)
    if (!response.ok) throw new Error('Error al obtener gastos')
    return response.json()
  },

  async create({ evento_id, concepto, monto }) {
    const response = await fetch(`${API_URL}/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento_id, concepto, monto }),
    })
    if (!response.ok) throw new Error('Error al crear gasto')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/gastos/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar gasto')
    return response.json()
  },
}
