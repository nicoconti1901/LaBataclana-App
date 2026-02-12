import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, EventoCard, BotonPrincipal } from '../components'
import { eventosService } from '../services/eventosService'
import { esEventoActivo } from '../utils/eventoUtils'
import imagenEventos from '../assets/—Pngtree—latin dancing feet bygema ibarra_10757310.jpg'
import './Eventos.css'

function Eventos() {
  const navigate = useNavigate()
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventosService.getAll()
        // Ordenar: Activos primero (fecha desc), luego Finalizados (fecha desc)
        const sorted = [...data].sort((a, b) => {
          const aActivo = esEventoActivo(a.fecha) ? 1 : 0
          const bActivo = esEventoActivo(b.fecha) ? 1 : 0
          if (aActivo !== bActivo) return bActivo - aActivo
          return new Date(b.fecha) - new Date(a.fecha)
        })
        setEventos(sorted)
      } catch {
        setError('No se pudieron cargar los eventos')
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  const count = eventos.length
  const gridClass = count <= 2 ? 'eventos-grid--few' : count <= 4 ? 'eventos-grid--medium' : 'eventos-grid--many'

  if (loading) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <div className="eventos">
          <p className="eventos__loading">Cargando eventos...</p>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout backgroundImage={imagenEventos}>
        <div className="eventos">
          <p className="eventos__error">{error}</p>
          <BotonPrincipal variant="secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </BotonPrincipal>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout backgroundImage={imagenEventos}>
      <div className="eventos">
        <button className="eventos__back" onClick={() => navigate('/')}>
          ← Inicio
        </button>
        <button className="eventos__new" onClick={() => navigate('/crear-evento')}>
          + Nuevo evento
        </button>

        <header className="eventos__header">
          <h1 className="eventos__title">Mis Eventos</h1>
          <p className="eventos__subtitle">
            Administracion de mis milongas con los detalles de cada una
          </p>
        </header>

        {eventos.length === 0 ? (
          <div className="eventos__empty">
            <p>No hay eventos creados</p>
            <BotonPrincipal variant="primary" onClick={() => navigate('/crear-evento')}>
              Crear primer evento
            </BotonPrincipal>
          </div>
        ) : (
          <div className={`eventos-grid ${gridClass}`}>
            {eventos.map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Eventos
