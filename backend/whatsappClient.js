// Cliente WhatsApp con whatsapp-web.js - envía imágenes desde el número de la milonga
// La primera vez hay que escanear el QR que aparece en la consola

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { Client } = require('whatsapp-web.js')
const { LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

let client = null
let isReady = false

export function isWhatsAppReady() {
  return isReady && client !== null
}

export function initWhatsApp() {
  if (client) return client

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  })

  client.on('qr', (qr) => {
    console.log('\n📱 Escanea este QR con WhatsApp en tu teléfono (Configuración > Dispositivos vinculados):\n')
    qrcode.generate(qr, { small: true })
  })

  client.on('ready', () => {
    isReady = true
    console.log('✅ WhatsApp conectado')
  })

  client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación WhatsApp:', msg)
    isReady = false
  })

  client.on('disconnected', () => {
    isReady = false
  })

  client.initialize().catch((err) => {
    console.error('Error al inicializar WhatsApp:', err)
  })

  return client
}

function formatChatId(celular) {
  let digits = String(celular).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('15') && digits.length === 11) digits = digits.slice(2)
  const numero = digits.startsWith('54') && digits.length >= 12 ? digits : `549${digits.slice(-10)}`
  return `${numero}@c.us`
}

export async function enviarImagen(telefono, imagenBase64) {
  if (!client || !isReady) {
    throw new Error('WhatsApp no está conectado. Escanea el QR en la consola del backend.')
  }

  const { MessageMedia } = require('whatsapp-web.js')

  const chatId = formatChatId(telefono)
  if (!chatId) throw new Error('Número de teléfono inválido')

  const media = new MessageMedia('image/png', imagenBase64)
  await client.sendMessage(chatId, media, { caption: 'Tu entrada para la milonga' })

  return { success: true }
}
