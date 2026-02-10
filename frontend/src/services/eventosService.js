const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const eventosService = {
  async getAll() {
    const response = await fetch(`${API_URL}/eventos`)
    if (!response.ok) throw new Error('Error al obtener eventos')
    return response.json()
  },

  async getActivos() {
    const response = await fetch(`${API_URL}/eventos/activos`)
    if (!response.ok) throw new Error('Error al obtener eventos activos')
    return response.json()
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/eventos/${id}`)
    if (!response.ok) throw new Error('Error al obtener evento')
    return response.json()
  },

  async create({ lugar, fecha, estado }) {
    const response = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lugar, fecha, estado }),
    })
    if (!response.ok) throw new Error('Error al crear evento')
    return response.json()
  },

  async update(id, { lugar, fecha, estado }) {
    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lugar, fecha, estado }),
    })
    if (!response.ok) throw new Error('Error al actualizar evento')
    return response.json()
  },

  async cambiarEstado(id, estado) {
    const response = await fetch(`${API_URL}/eventos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    if (!response.ok) throw new Error('Error al cambiar estado del evento')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar evento')
    return response.json()
  },
}
