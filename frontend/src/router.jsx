import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CrearEvento from './pages/CrearEvento'
import Eventos from './pages/Eventos'
import EventoDetalle from './pages/EventoDetalle'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/eventos/:id" element={<EventoDetalle />} />
      <Route path="/crear-evento" element={<CrearEvento />} />
    </Routes>
  )
}

export default Router
