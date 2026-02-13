import { forwardRef } from 'react'
import fondo1 from '../../../assets/fondo1.png'
import logoPrincipal from '../../../assets/logofinal.png'
import './EntradaDigital.css'

const EntradaDigital = forwardRef(({ reserva, evento }, ref) => {
  if (!reserva) return null

  const formatFecha = (fecha) => {
    if (!fecha) return 'Por confirmar'
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div ref={ref} className="entrada-digital">
      <div className="entrada-digital__logo">
        <img src={logoPrincipal} alt="Milonga Bataclana" className="entrada-digital__logo-img" />
      </div>

      <div className="entrada-digital__strip" />

      <div className="entrada-digital__content" style={{ backgroundImage: `url(${fondo1})` }}>
        <h2 className="entrada-digital__titulo">Entrada · Milonga</h2>
        <p className="entrada-digital__lugar">{evento?.lugar || 'Milonga'}</p>
        {evento?.direccion && (
          <p className="entrada-digital__direccion">{evento.direccion}</p>
        )}
        <p className="entrada-digital__fecha">{formatFecha(evento?.fecha)}</p>

        <div className="entrada-digital__sorteo">
          <span className="entrada-digital__sorteo-label">N° de sorteo</span>
          <span className="entrada-digital__sorteo-numero">{reserva.numero_sorteo}</span>
        </div>

        {!!reserva.consumicion && (
          <div className="entrada-digital__consumicion">
            <span className="entrada-digital__consumicion-icon">✦</span>
            Incluye consumición
          </div>
        )}

        <p className="entrada-digital__nombre">{reserva.nombre}</p>
      </div>

      <div className="entrada-digital__strip entrada-digital__strip--bottom" />
    </div>
  )
})

EntradaDigital.displayName = 'EntradaDigital'

export default EntradaDigital
