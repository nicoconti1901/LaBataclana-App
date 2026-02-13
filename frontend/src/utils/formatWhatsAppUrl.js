export default function formatWhatsAppUrl(celular) {
  if (!celular) return null
  let digits = String(celular).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('15') && digits.length === 11) digits = digits.slice(2)
  const numero = digits.startsWith('54') && digits.length >= 12 ? digits : `549${digits.slice(-10)}`
  return `https://wa.me/${numero}`
}
