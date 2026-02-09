const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const whatsappService = {
  async enviarMensaje(telefono, mensaje) {
    const response = await fetch(`${API_URL}/whatsapp/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telefono, mensaje }),
    })
    if (!response.ok) throw new Error('Error al enviar mensaje de WhatsApp')
    return response.json()
  },

  async enviarTicket(telefono, ticketData) {
    const response = await fetch(`${API_URL}/whatsapp/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telefono, ticketData }),
    })
    if (!response.ok) throw new Error('Error al enviar ticket por WhatsApp')
    return response.json()
  },
}
