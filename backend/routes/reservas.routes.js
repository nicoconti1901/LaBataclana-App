import express from 'express'
import { getDB } from '../db.js'

const router = express.Router()

// GET /api/reservas - Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const reservas = await db.all(`
      SELECT r.*, e.nombre as evento_nombre 
      FROM reservas r 
      LEFT JOIN eventos e ON r.evento_id = e.id 
      ORDER BY r.creado_en DESC
    `)
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reservas/:id - Obtener una reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB()
    const reserva = await db.get(`
      SELECT r.*, e.nombre as evento_nombre 
      FROM reservas r 
      LEFT JOIN eventos e ON r.evento_id = e.id 
      WHERE r.id = ?
    `, [req.params.id])
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json(reserva)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reservas/evento/:eventoId - Obtener reservas de un evento
router.get('/evento/:eventoId', async (req, res) => {
  try {
    const db = getDB()
    const reservas = await db.all(
      'SELECT * FROM reservas WHERE evento_id = ? ORDER BY creado_en DESC',
      [req.params.eventoId]
    )
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/reservas - Crear una nueva reserva
router.post('/', async (req, res) => {
  try {
    const { evento_id, nombre, email, telefono, cantidad, codigo, numero_sorteo } = req.body
    const db = getDB()
    
    // Generar código único si no se proporciona
    let codigoReserva = codigo || `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const result = await db.run(
      'INSERT INTO reservas (evento_id, nombre, email, telefono, cantidad, codigo, numero_sorteo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [evento_id, nombre, email, telefono, cantidad, codigoReserva, numero_sorteo || null]
    )
    
    const reserva = await db.get('SELECT * FROM reservas WHERE id = ?', [result.lastID])
    res.status(201).json(reserva)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
