import express from 'express'
import crypto from 'crypto'
import { getDB } from '../db.js'

const router = express.Router()

// GET /api/reservas - Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const pool = getDB()
    const [reservas] = await pool.execute(`
      SELECT r.*, e.lugar as evento_lugar, e.fecha as evento_fecha
      FROM reservas r
      LEFT JOIN eventos e ON r.evento_id = e.id
      ORDER BY r.created_at DESC
    `)
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reservas/:id - Obtener una reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getDB()
    const [rows] = await pool.execute(`
      SELECT r.*, e.lugar as evento_lugar, e.fecha as evento_fecha
      FROM reservas r
      LEFT JOIN eventos e ON r.evento_id = e.id
      WHERE r.id = ?
    `, [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reservas/evento/:eventoId - Obtener reservas de un evento
router.get('/evento/:eventoId', async (req, res) => {
  try {
    const pool = getDB()
    const [reservas] = await pool.execute(
      'SELECT * FROM reservas WHERE evento_id = ? ORDER BY numero_sorteo ASC',
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
    const { nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo, evento_id } = req.body
    const id = crypto.randomUUID()
    const pool = getDB()

    await pool.execute(
      'INSERT INTO reservas (id, nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo, evento_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nombre, celular, pago || false, forma_pago || null, consumicion || false, importe || null, numero_sorteo, evento_id]
    )

    const [rows] = await pool.execute('SELECT * FROM reservas WHERE id = ?', [id])
    res.status(201).json(rows[0])
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El número de sorteo ya está asignado para este evento' })
    }
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/reservas/:id - Actualizar una reserva
router.put('/:id', async (req, res) => {
  try {
    const { nombre, celular, pago, forma_pago, consumicion, importe, numero_sorteo } = req.body
    const pool = getDB()
    const [result] = await pool.execute(
      'UPDATE reservas SET nombre = ?, celular = ?, pago = ?, forma_pago = ?, consumicion = ?, importe = ?, numero_sorteo = ? WHERE id = ?',
      [nombre, celular, pago, forma_pago || null, consumicion, importe || null, numero_sorteo, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    const [rows] = await pool.execute('SELECT * FROM reservas WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El número de sorteo ya está asignado para este evento' })
    }
    res.status(500).json({ error: error.message })
  }
})

// PATCH /api/reservas/:id/pago - Actualizar estado de pago
router.patch('/:id/pago', async (req, res) => {
  try {
    const { pago, forma_pago, importe } = req.body
    const pool = getDB()
    const [result] = await pool.execute(
      'UPDATE reservas SET pago = ?, forma_pago = ?, importe = ? WHERE id = ?',
      [pago, forma_pago || null, importe || null, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    const [rows] = await pool.execute('SELECT * FROM reservas WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PATCH /api/reservas/:id/consumicion - Actualizar consumición
router.patch('/:id/consumicion', async (req, res) => {
  try {
    const { consumicion } = req.body
    const pool = getDB()
    const [result] = await pool.execute(
      'UPDATE reservas SET consumicion = ? WHERE id = ?',
      [consumicion, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    const [rows] = await pool.execute('SELECT * FROM reservas WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/reservas/:id - Eliminar una reserva
router.delete('/:id', async (req, res) => {
  try {
    const pool = getDB()
    const [result] = await pool.execute('DELETE FROM reservas WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json({ message: 'Reserva eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
