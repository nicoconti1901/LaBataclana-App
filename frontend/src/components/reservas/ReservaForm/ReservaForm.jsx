import { useState } from 'react'
import BotonPrincipal from '../../ui/BotonPrincipal/BotonPrincipal'
import './ReservaForm.css'

function ReservaForm({ eventoId, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    forma_pago: '',
    importe: '',
    pago: false,
    consumicion: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      importe: formData.importe ? parseFloat(formData.importe) : null,
      forma_pago: formData.forma_pago || null,
      consumicion: formData.consumicion,
      evento_id: eventoId
    })
  }

  return (
    <form className="reserva-form" onSubmit={handleSubmit}>
      <div className="reserva-form__group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="reserva-form__group">
        <label htmlFor="celular">Celular</label>
        <input
          id="celular"
          name="celular"
          type="tel"
          placeholder="Número de celular"
          value={formData.celular}
          onChange={handleChange}
          required
        />
      </div>

      <p className="reserva-form__hint">El número de sorteo se asignará automáticamente al guardar.</p>

      <div className="reserva-form__group">
        <label htmlFor="forma_pago">Forma de pago</label>
        <select
          id="forma_pago"
          name="forma_pago"
          value={formData.forma_pago}
          onChange={handleChange}
        >
          <option value="">Seleccionar...</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <div className="reserva-form__group">
        <label htmlFor="importe">Importe</label>
        <input
          id="importe"
          name="importe"
          type="number"
          placeholder="Importe"
          value={formData.importe}
          onChange={handleChange}
          step="0.01"
          min="0"
        />
      </div>

      <div className="reserva-form__group reserva-form__group--checkbox">
        <label>
          <input
            name="pago"
            type="checkbox"
            checked={formData.pago}
            onChange={handleChange}
          />
          Pagado
        </label>
      </div>

      <div className="reserva-form__group reserva-form__group--checkbox">
        <label>
          <input
            name="consumicion"
            type="checkbox"
            checked={formData.consumicion}
            onChange={handleChange}
          />
          Con consumición
        </label>
      </div>

      <div className="reserva-form__actions">
        <BotonPrincipal type="submit" variant="primary">
          Reservar
        </BotonPrincipal>
      </div>
    </form>
  )
}

export default ReservaForm
