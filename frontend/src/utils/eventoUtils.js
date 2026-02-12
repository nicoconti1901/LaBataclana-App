/**
 * Determina el estado del evento según la fecha.
 * Si la fecha del evento es anterior a hoy → "Finalizado"
 * Si la fecha del evento es hoy o posterior → "Activo"
 */
export function getEstadoFromFecha(fecha) {
  if (!fecha) return 'Activo'
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaEvento = new Date(fecha)
  fechaEvento.setHours(0, 0, 0, 0)
  return fechaEvento < hoy ? 'Finalizado' : 'Activo'
}

export function esEventoActivo(fecha) {
  return getEstadoFromFecha(fecha) === 'Activo'
}
