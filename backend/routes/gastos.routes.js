import express from 'express'
import crypto from 'crypto'
import { getDB } from '../db.js'

const router = express.Router()

// GET /api/gastos/evento/:eventoId - Obtener gastos de un evento
router.get('/evento/:eventoId', async (req, res) => {
  try {
    const pool = getDB()
    const [gastos] = await pool.execute(
      'SELECT * FROM gastos WHERE evento_id = ? ORDER BY created_at DESC',
      [req.params.eventoId]
    )
    res.json(gastos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/gastos - Crear un gasto
router.post('/', async (req, res) => {
  try {
    const { evento_id, concepto, monto } = req.body
    const id = crypto.randomUUID()
    const pool = getDB()
    await pool.execute(
      'INSERT INTO gastos (id, evento_id, concepto, monto) VALUES (?, ?, ?, ?)',
      [id, evento_id, concepto, monto]
    )
    const [rows] = await pool.execute('SELECT * FROM gastos WHERE id = ?', [id])
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/gastos/:id - Eliminar un gasto
router.delete('/:id', async (req, res) => {
  try {
    const pool = getDB()
    const [result] = await pool.execute('DELETE FROM gastos WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' })
    }
    res.json({ message: 'Gasto eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
