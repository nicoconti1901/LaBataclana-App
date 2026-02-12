import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDB } from './db.js'
import eventosRoutes from './routes/eventos.routes.js'
import reservasRoutes from './routes/reservas.routes.js'
import gastosRoutes from './routes/gastos.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize database
initDB().then(() => {
  console.log('Database initialized')
}).catch(err => {
  console.error('Error initializing database:', err)
})

// Routes
app.use('/api/eventos', eventosRoutes)
app.use('/api/reservas', reservasRoutes)
app.use('/api/gastos', gastosRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
