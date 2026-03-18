/**
 * WhatsApp Cloud API (Meta / Facebook)
 * https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Requiere en .env:
 *   WHATSAPP_ACCESS_TOKEN  - Token de acceso de la app de Meta
 *   WHATSAPP_PHONE_NUMBER_ID - ID del número de teléfono en Meta Business
 *
 * Configuración: Meta for Developers → Tu app → WhatsApp → API Setup
 */

const API_VERSION = process.env.WHATSAPP_API_VERSION || '21.0'
const BASE_URL = `https://graph.facebook.com/v${API_VERSION}`

function isConfigured() {
  return !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
}

function getPhoneNumberId() {
  return process.env.WHATSAPP_PHONE_NUMBER_ID
}

function getAccessToken() {
  return process.env.WHATSAPP_ACCESS_TOKEN
}

/**
 * Normaliza número para la API: solo dígitos, código país sin +
 * Ej: +54 9 11 1234-5678 → 5491112345678
 */
function formatPhoneForApi(telefono) {
  let digits = String(telefono).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('15') && digits.length === 11) digits = digits.slice(2)
  if (digits.startsWith('54') && digits.length >= 12) return digits
  return `549${digits.slice(-10)}`
}

/**
 * Sube la imagen a Meta y devuelve el media ID
 */
async function uploadMedia(imageBuffer, mimeType = 'image/png') {
  const phoneNumberId = getPhoneNumberId()
  const token = getAccessToken()
  const url = `${BASE_URL}/${phoneNumberId}/media`

  const form = new FormData()
  form.append('messaging_product', 'whatsapp')
  form.append('type', mimeType)
  form.append('file', new Blob([imageBuffer], { type: mimeType }), 'entrada.png')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Meta API upload: ${response.status}`)
  }

  const data = await response.json()
  return data.id
}

/**
 * Envía un mensaje de imagen usando el media ID devuelto por uploadMedia
 */
async function sendImageByMediaId(to, mediaId, caption = 'Tu entrada para la milonga') {
  const phoneNumberId = getPhoneNumberId()
  const token = getAccessToken()
  const url = `${BASE_URL}/${phoneNumberId}/messages`

  const toDigits = String(to).replace(/\D/g, '')
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toDigits,
      type: 'image',
      image: {
        id: mediaId,
        caption
      }
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Meta API send: ${response.status}`)
  }

  return response.json()
}

/**
 * Envía la entrada (imagen en base64) por WhatsApp Cloud API
 */
export async function enviarImagenMeta(telefono, imagenBase64) {
  if (!isConfigured()) {
    throw new Error('WhatsApp Meta no configurado: falta WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID')
  }

  const numero = formatPhoneForApi(telefono)
  if (!numero) throw new Error('Número de teléfono inválido')

  let base64 = imagenBase64
  if (base64.includes(',')) base64 = base64.split(',')[1]

  const buffer = Buffer.from(base64, 'base64')
  const mediaId = await uploadMedia(buffer, 'image/png')
  await sendImageByMediaId(numero, mediaId)

  return { success: true }
}

export default {
  isConfigured,
  enviarImagenMeta
}
