import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import EntradaDigital from './EntradaDigital'
import formatWhatsAppUrl from '../../../utils/formatWhatsAppUrl'
import { whatsappService } from '../../../services/whatsappService'
import './EntradaDigitalModal.css'

function EntradaDigitalModal({ reserva, evento, onClose }) {
  const ticketRef = useRef(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleEnviarWhatsApp = async () => {
    if (!ticketRef.current || !reserva?.celular) return
    setEnviando(true)
    setError(null)
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a'
      })
      const imagenBase64 = canvas.toDataURL('image/png')
      const whatsappUrl = formatWhatsAppUrl(reserva.celular)

      try {
        await whatsappService.enviarEntrada(reserva.celular, imagenBase64)
        onClose()
      } catch (apiErr) {
        const link = document.createElement('a')
        link.download = `entrada_${reserva.nombre?.replace(/\s+/g, '_') || 'entrada'}_sorteo${reserva.numero_sorteo}.png`
        link.href = imagenBase64
        link.click()
        if (whatsappUrl) window.open(whatsappUrl, '_blank')
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Error al enviar')
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="entrada-modal__overlay" onClick={onClose}>
      <div className="entrada-modal" onClick={e => e.stopPropagation()}>
        <button className="entrada-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        <EntradaDigital ref={ticketRef} reserva={reserva} evento={evento} />
        <div className="entrada-modal__actions">
          {reserva?.celular ? (
            <>
              <button
                type="button"
                className="entrada-modal__btn entrada-modal__btn--whatsapp"
                onClick={handleEnviarWhatsApp}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              {error && <span className="entrada-modal__error">{error}</span>}
            </>
          ) : (
            <span className="entrada-modal__sin-celular">Sin número para enviar</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntradaDigitalModal
