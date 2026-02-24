import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Sorteo.css'

function Sorteo({ reservas = [] }) {
  const [abierto, setAbierto] = useState(false)
  const [sorteando, setSorteando] = useState(false)
  const [ganador, setGanador] = useState(null)
  const [mostrando, setMostrando] = useState(null)
  const [celebrar, setCelebrar] = useState(false)
  const [ganadoresExcluidos, setGanadoresExcluidos] = useState(() => new Set())
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const iniciarSorteo = useCallback(() => {
    if (reservas.length === 0) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setGanador(null)
    setCelebrar(false)
    setSorteando(true)

    const disponibles = reservas.filter(r => !ganadoresExcluidos.has(r.id))
    const pool = disponibles.length > 0 ? disponibles : reservas
    if (disponibles.length === 0) setGanadoresExcluidos(new Set())
    setMostrando(pool[0])

    const ganadorFinal = pool[Math.floor(Math.random() * pool.length)]
    const duracion = 7200
    let intervaloBase = 60

    const ciclar = () => {
      const idx = Math.floor(Math.random() * pool.length)
      setMostrando(pool[idx])
    }

    intervalRef.current = setInterval(ciclar, intervaloBase)

    const desacelerar = () => {
      intervaloBase = Math.min(intervaloBase + 15, 200)
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(ciclar, intervaloBase)
    }

    setTimeout(desacelerar, duracion * 0.5)
    setTimeout(desacelerar, duracion * 0.75)

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setMostrando(ganadorFinal)
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        setGanador(ganadorFinal)
        setGanadoresExcluidos(prev => new Set([...prev, ganadorFinal.id]))
        setSorteando(false)
        setCelebrar(true)
        setTimeout(() => setCelebrar(false), 2000)
      }, 400)
    }, duracion)
  }, [reservas, ganadoresExcluidos])

  const hayReservas = reservas.length > 0

  const cerrarSorteo = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
    setAbierto(false)
    setGanador(null)
    setMostrando(null)
    setGanadoresExcluidos(new Set())
    setCelebrar(false)
    setSorteando(false)
  }, [])

  return (
    <>
      <motion.button
        type="button"
        className="sorteo-trigger"
        onClick={() => setAbierto(true)}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        title="Abrir sorteo"
      >
        <span className="sorteo-trigger__icon">🎲</span>
        <span>Sorteo</span>
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="sorteo-modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="sorteo-overlay"
              onClick={cerrarSorteo}
            />
            <motion.div
              className="sorteo-ventana-wrapper"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sorteo-ventana">
              <div className="sorteo-ventana__header">
                <h3 className="sorteo-ventana__titulo">
                  <span>🎲</span> Sorteo
                </h3>
                <button
                  type="button"
                  className="sorteo-ventana__cerrar"
                  onClick={cerrarSorteo}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="sorteo-ventana__body">
                <div className={`sorteo-ventana__display ${sorteando ? 'sorteo-ventana__display--girando' : ''} ${celebrar ? 'sorteo-ventana__display--celebrar' : ''}`}>
                  <AnimatePresence mode="wait">
                    {!ganador ? (
                      <motion.div
                        key="sorteo-activo"
                        className="sorteo-ventana__contenido"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {mostrando ? (
                          <>
                            <motion.span
                              className="sorteo-ventana__numero"
                              key={mostrando.id}
                              initial={{ scale: 0.5, rotate: -10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              {mostrando.numero_sorteo}
                            </motion.span>
                            <span className="sorteo-ventana__nombre">{mostrando.nombre}</span>
                          </>
                        ) : (
                          <span className="sorteo-ventana__placeholder">
                            {hayReservas ? '¿Quién gana?' : 'Sin reservas'}
                          </span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sorteo-ganador"
                        className="sorteo-ventana__ganador"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <span className="sorteo-ventana__ganador-label">¡Ganador!</span>
                        <motion.span
                          className="sorteo-ventana__ganador-numero"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          {ganador.numero_sorteo}
                        </motion.span>
                        <span className="sorteo-ventana__ganador-nombre">{ganador.nombre}</span>
                        {celebrar && (
                          <div className="sorteo-confetti" aria-hidden>
                            {[...Array(16)].map((_, i) => (
                              <span key={i} className="sorteo-confetti__item" style={{ '--i': i }} />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className="sorteo-ventana__btn"
                  onClick={iniciarSorteo}
                  disabled={!hayReservas || sorteando}
                  title={!hayReservas ? 'Agregue reservas para realizar el sorteo' : ''}
                >
                  {sorteando ? (
                    <span className="sorteo-ventana__btn-text">¡Girando...!</span>
                  ) : ganador ? (
                    '🎲 Sortear otra vez'
                  ) : (
                    '🎲 ¡Realizar sorteo!'
                  )}
                </button>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sorteo
