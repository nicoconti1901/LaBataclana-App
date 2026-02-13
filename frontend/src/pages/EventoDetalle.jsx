import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BotonPrincipal, PageLayout, ReservaForm, ReservaList } from '../components'
import { eventosService } from '../services/eventosService'
import { reservasService } from '../services/reservasService'
import { gastosService } from '../services/gastosService'
import { getEstadoFromFecha } from '../utils/eventoUtils'
import imagenEventos from '../assets/—Pngtree—latin dancing feet bygema ibarra_10757310.jpg'
import './EventoDetalle.css'

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: '◆' },
  { id: 'reservas', label: 'Reservas', icon: '♫' },
  { id: 'finanzas', label: 'Finanzas', icon: '✦' },
]

const tangoSpring = { type: 'spring', stiffness: 65, damping: 15 }
const statVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const financeCardVariants = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }

function EventoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resumen')
  const [evento, setEvento] = useState(null)
  const [reservas, setReservas] = useState([])
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReservaForm, setShowReservaForm] = useState(false)
  const [gastoConcepto, setGastoConcepto] = useState('')
  const [gastoMonto, setGastoMonto] = useState('')

  const fetchData = async () => {
    if (!id) return
    try {
      const [eventoData, reservasData, gastosData] = await Promise.all([
        eventosService.getById(id),
        reservasService.getByEventoId(id),
        gastosService.getByEventoId(id),
      ])
      setEvento(eventoData)
      setReservas(reservasData)
      setGastos(gastosData)
      setError(null)
    } catch {
      setError('No se pudo cargar el evento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (activeTab !== 'reservas') setShowReservaForm(false)
  }, [activeTab])

  const formatFecha = (fecha) => {
    if (!fecha) return 'Por confirmar'
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCrearReserva = async (data) => {
    try {
      await reservasService.create(data)
      setReservas(await reservasService.getByEventoId(id))
      setShowReservaForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleTogglePago = async (reserva) => {
    try {
      await reservasService.actualizarPago(reserva.id, {
        pago: !reserva.pago,
        forma_pago: reserva.forma_pago,
        importe: reserva.importe,
      })
      setReservas(await reservasService.getByEventoId(id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleToggleConsumicion = async (reserva) => {
    try {
      await reservasService.actualizarConsumicion(reserva.id, !reserva.consumicion)
      setReservas(await reservasService.getByEventoId(id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAgregarGasto = async (e) => {
    e.preventDefault()
    if (!gastoConcepto.trim() || !gastoMonto || parseFloat(gastoMonto) <= 0) return
    try {
      await gastosService.create({ evento_id: id, concepto: gastoConcepto.trim(), monto: parseFloat(gastoMonto) })
      setGastos(await gastosService.getByEventoId(id))
      setGastoConcepto('')
      setGastoMonto('')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminarGasto = async (gastoId) => {
    if (!confirm('¿Eliminar este gasto?')) return
    try {
      await gastosService.delete(gastoId)
      setGastos(await gastosService.getByEventoId(id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminarEvento = async () => {
    if (!confirm('¿Está seguro que desea eliminar este evento? Se eliminarán también todas las reservas y gastos asociados. Esta acción no se puede deshacer.')) return
    try {
      await eventosService.delete(id)
      navigate('/eventos')
    } catch (err) {
      alert(err.message)
    }
  }

  const ganancias = reservas.filter(r => r.pago && r.importe).reduce((sum, r) => sum + parseFloat(r.importe || 0), 0)
  const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0)
  const balance = ganancias - totalGastos

  if (loading) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <p className="evento-detalle__loading">Cargando...</p>
      </PageLayout>
    )
  }

  if (error || !evento) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <div className="evento-detalle">
          <div className="evento-detalle__card">
            <p className="evento-detalle__error">{error || 'Evento no encontrado'}</p>
            <BotonPrincipal variant="secondary" onClick={() => navigate('/')}>
              Volver al inicio
            </BotonPrincipal>
          </div>
        </div>
      </PageLayout>
    )
  }

  const estado = getEstadoFromFecha(evento.fecha)

  return (
    <PageLayout backgroundImage={imagenEventos}>
      <div className="evento-detalle">
        <div className="evento-detalle__card">
          <div className="evento-detalle__top-bar">
            <button className="evento-detalle__back" onClick={() => navigate('/eventos')}>
              ← Mis Eventos
            </button>
            <button className="evento-detalle__eliminar" onClick={handleEliminarEvento} title="Eliminar evento">
              Eliminar evento
            </button>
          </div>

          <motion.header
            className="evento-detalle__header"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tangoSpring, delay: 0.1 }}
          >
            <span className={`evento-detalle__estado evento-detalle__estado--${estado.toLowerCase()}`}>
              {estado}
            </span>
            <h1 className="evento-detalle__titulo">{evento.lugar}</h1>
            {evento.direccion && <p className="evento-detalle__direccion">{evento.direccion}</p>}
            <p className="evento-detalle__fecha">{formatFecha(evento.fecha)}</p>
          </motion.header>

          <motion.nav
            className="evento-detalle__tabs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                className={`evento-detalle__tab ${activeTab === tab.id ? 'evento-detalle__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="evento-detalle__tab-icon">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </motion.nav>

          <div className="evento-detalle__content">
            <AnimatePresence mode="wait">
              {activeTab === 'resumen' && (
                <motion.section
                  key="resumen"
                  className="evento-detalle__section"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={tangoSpring}
                >
                  <motion.div
                    className="evento-detalle__stats"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.08 } },
                      hidden: {}
                    }}
                  >
                    <motion.div className="evento-detalle__stat evento-detalle__stat--reservas" variants={statVariants} transition={tangoSpring}>
                      <span className="evento-detalle__stat-value">{reservas.length}</span>
                      <span className="evento-detalle__stat-label">Reservas</span>
                    </motion.div>
                    <motion.div className="evento-detalle__stat evento-detalle__stat--ganancias" variants={statVariants} transition={tangoSpring}>
                      <span className="evento-detalle__stat-value">${ganancias.toFixed(0)}</span>
                      <span className="evento-detalle__stat-label">Ingresos</span>
                    </motion.div>
                    <motion.div className="evento-detalle__stat evento-detalle__stat--gastos" variants={statVariants} transition={tangoSpring}>
                      <span className="evento-detalle__stat-value">${totalGastos.toFixed(0)}</span>
                      <span className="evento-detalle__stat-label">Gastos</span>
                    </motion.div>
                    <motion.div className={`evento-detalle__stat evento-detalle__stat--balance ${balance >= 0 ? '' : 'evento-detalle__stat--negativo'}`} variants={statVariants} transition={tangoSpring}>
                      <span className="evento-detalle__stat-value">${balance.toFixed(0)}</span>
                      <span className="evento-detalle__stat-label">Balance</span>
                    </motion.div>
                  </motion.div>
                </motion.section>
              )}

              {activeTab === 'reservas' && (
                <motion.section
                  key="reservas"
                  className="evento-detalle__section"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={tangoSpring}
                >
                <div className="evento-detalle__section-header">
                  <h2>Reservas</h2>
                  <BotonPrincipal
                    variant="primary"
                    onClick={() => setShowReservaForm(!showReservaForm)}
                  >
                    {showReservaForm ? 'Cancelar' : '+ Nueva reserva'}
                  </BotonPrincipal>
                </div>
                <AnimatePresence>
                  {showReservaForm && (
                    <motion.div
                      className="evento-detalle__form-wrapper"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={tangoSpring}
                    >
                      <ReservaForm eventoId={id} onSubmit={handleCrearReserva} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...tangoSpring, delay: 0.15 }}
                >
                <ReservaList
                  reservas={reservas}
                  evento={evento}
                  onTogglePago={handleTogglePago}
                  onToggleConsumicion={handleToggleConsumicion}
                />
                </motion.div>
              </motion.section>
            )}

              {activeTab === 'finanzas' && (
                <motion.section
                  key="finanzas"
                  className="evento-detalle__section"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={tangoSpring}
                >
                <h2>Gastos y Ganancias</h2>
                <motion.div
                  className="evento-detalle__finanzas-grid"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: {}
                  }}
                >
                  <motion.div className="evento-detalle__finanzas-card evento-detalle__finanzas-card--ingresos" variants={financeCardVariants} transition={tangoSpring}>
                    <h3>Ingresos</h3>
                    <p className="evento-detalle__monto">${ganancias.toFixed(2)}</p>
                    <span>Reservas cobradas</span>
                  </motion.div>
                  <motion.div className="evento-detalle__finanzas-card evento-detalle__finanzas-card--gastos" variants={financeCardVariants} transition={tangoSpring}>
                    <h3>Gastos</h3>
                    <p className="evento-detalle__monto">${totalGastos.toFixed(2)}</p>
                    <span>{gastos.length} registros</span>
                  </motion.div>
                  <motion.div className="evento-detalle__finanzas-card evento-detalle__finanzas-card--balance" variants={financeCardVariants} transition={tangoSpring}>
                    <h3>Balance</h3>
                    <p className={`evento-detalle__monto ${balance >= 0 ? '' : 'evento-detalle__monto--negativo'}`}>
                      ${balance.toFixed(2)}
                    </p>
                  </motion.div>
                </motion.div>

                <div className="evento-detalle__gastos-form">
                  <h3>Agregar gasto</h3>
                  <form onSubmit={handleAgregarGasto} className="evento-detalle__gasto-form">
                    <input
                      type="text"
                      placeholder="Concepto (ej: alquiler, música)"
                      value={gastoConcepto}
                      onChange={(e) => setGastoConcepto(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Monto"
                      value={gastoMonto}
                      onChange={(e) => setGastoMonto(e.target.value)}
                      step="0.01"
                      min="0"
                      required
                    />
                    <BotonPrincipal type="submit" variant="secondary">Agregar</BotonPrincipal>
                  </form>
                </div>

                {gastos.length > 0 && (
                  <motion.div
                    className="evento-detalle__gastos-list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...tangoSpring, delay: 0.2 }}
                  >
                    <h3>Listado de gastos</h3>
                    <ul>
                      {gastos.map((g, idx) => (
                        <motion.li
                          key={g.id}
                          className="evento-detalle__gasto-item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...tangoSpring, delay: 0.25 + idx * 0.03 }}
                        >
                          <span className="evento-detalle__gasto-concepto">{g.concepto}</span>
                          <span className="evento-detalle__gasto-monto">${parseFloat(g.monto).toFixed(2)}</span>
                          <button
                            type="button"
                            className="evento-detalle__gasto-eliminar"
                            onClick={() => handleEliminarGasto(g.id)}
                            title="Eliminar"
                          >
                            ×
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.section>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventoDetalle
