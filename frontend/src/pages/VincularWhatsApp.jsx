import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappService } from '../services/whatsappService'
import './VincularWhatsApp.css'

const POLL_INTERVAL = 2000

function VincularWhatsApp() {
  const [status, setStatus] = useState({ conectado: false, qr: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let interval

    const fetchStatus = async () => {
      try {
        const data = await whatsappService.getStatus()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError('No se pudo conectar con el servidor. ¿Está el backend en marcha?')
        setStatus({ conectado: false, qr: null })
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    interval = setInterval(fetchStatus, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="vincular-whatsapp">
        <div className="vincular-whatsapp__card">
          <p className="vincular-whatsapp__loading">Comprobando estado de WhatsApp...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vincular-whatsapp">
        <div className="vincular-whatsapp__card vincular-whatsapp__card--error">
          <p className="vincular-whatsapp__error">{error}</p>
          <Link to="/" className="vincular-whatsapp__link">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="vincular-whatsapp">
      <div className="vincular-whatsapp__card">
        <h1 className="vincular-whatsapp__title">WhatsApp de La Bataclana</h1>

        {status.conectado ? (
          <div className="vincular-whatsapp__conectado">
            <span className="vincular-whatsapp__badge vincular-whatsapp__badge--ok">Conectado</span>
            {status.modo === 'meta' && (
              <p className="vincular-whatsapp__meta">Usando la API oficial de WhatsApp (Meta).</p>
            )}
            <p>Podés enviar entradas desde la app.</p>
            <Link to="/eventos" className="vincular-whatsapp__link">Ir a eventos</Link>
          </div>
        ) : status.qr ? (
          <div className="vincular-whatsapp__qr">
            <p className="vincular-whatsapp__instrucciones">
              Escaneá este código con el celular que vas a usar para enviar las entradas:
            </p>
            <p className="vincular-whatsapp__pasos">
              WhatsApp → Configuración → Dispositivos vinculados → Vincular dispositivo
            </p>
            <img
              src={status.qr}
              alt="Código QR para vincular WhatsApp"
              className="vincular-whatsapp__img"
            />
            <p className="vincular-whatsapp__refresco">El código se actualiza solo cada unos segundos.</p>
          </div>
        ) : (
          <div className="vincular-whatsapp__espera">
            <span className="vincular-whatsapp__badge vincular-whatsapp__badge--wait">Preparando...</span>
            <p>Iniciando WhatsApp Web. En unos segundos debería aparecer el código QR.</p>
          </div>
        )}

        <Link to="/" className="vincular-whatsapp__back">← Volver al inicio</Link>
      </div>
    </div>
  )
}

export default VincularWhatsApp
