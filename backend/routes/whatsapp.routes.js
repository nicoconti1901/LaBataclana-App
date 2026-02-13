import express from 'express'
import { initWhatsApp, isWhatsAppReady, enviarImagen } from '../whatsappClient.js'

const router = express.Router()

router.get('/status', (req, res) => {
  res.json({ conectado: isWhatsAppReady() })
})

router.post('/enviar-entrada', async (req, res) => {
  try {
    const { telefono, imagenBase64 } = req.body
    if (!telefono || !imagenBase64) {
      return res.status(400).json({ error: 'Faltan telefono o imagenBase64' })
    }

    let base64 = imagenBase64
    if (base64.includes(',')) {
      base64 = base64.split(',')[1]
    }

    initWhatsApp()
    await enviarImagen(telefono, base64)
    res.json({ success: true })
  } catch (err) {
    console.error('Error enviar entrada:', err)
    res.status(500).json({ error: err.message || 'Error al enviar por WhatsApp' })
  }
})

export default router
