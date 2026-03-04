import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDB } from './db.js'
import eventosRoutes from './routes/eventos.routes.js'
import reservasRoutes from './routes/reservas.routes.js'
import gastosRoutes from './routes/gastos.routes.js'
import whatsappRoutes from './routes/whatsapp.routes.js'
import { initWhatsApp } from './whatsappClient.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/eventos', eventosRoutes)
app.use('/api/reservas', reservasRoutes)
app.use('/api/gastos', gastosRoutes)
app.use('/api/whatsapp', whatsappRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Iniciar servidor solo cuando la DB esté lista
initDB()
  .then(() => {
    console.log('Database initialized')
    initWhatsApp()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Error initializing database:', err)
    process.exit(1)
  })
