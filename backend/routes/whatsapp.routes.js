import express from 'express'
import { initWhatsApp, getWhatsAppStatus, enviarImagen } from '../whatsappClient.js'
import whatsappMeta from '../services/whatsappMeta.js'

const router = express.Router()

function useMetaApi() {
  return whatsappMeta.isConfigured()
}

router.get('/status', (req, res) => {
  if (useMetaApi()) {
    return res.json({ conectado: true, modo: 'meta', qr: null })
  }
  res.json(getWhatsAppStatus())
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

    if (useMetaApi()) {
      await whatsappMeta.enviarImagenMeta(telefono, base64)
    } else {
      initWhatsApp()
      await enviarImagen(telefono, base64)
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Error enviar entrada:', err)
    res.status(500).json({ error: err.message || 'Error al enviar por WhatsApp' })
  }
})

export default router
