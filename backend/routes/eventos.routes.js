import express from 'express'
import crypto from 'crypto'
import { getDB } from '../db.js'

const router = express.Router()

// GET /api/eventos - Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const pool = getDB()
    const [eventos] = await pool.execute('SELECT * FROM eventos ORDER BY fecha DESC')
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/eventos/activos - Obtener solo eventos activos
router.get('/activos', async (req, res) => {
  try {
    const pool = getDB()
    const [eventos] = await pool.execute(
      'SELECT * FROM eventos WHERE estado = ? ORDER BY fecha DESC',
      ['activo']
    )
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/eventos/:id - Obtener un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getDB()
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/eventos - Crear un nuevo evento
router.post('/', async (req, res) => {
  try {
    const { lugar, fecha, estado } = req.body
    const id = crypto.randomUUID()
    const pool = getDB()
    await pool.execute(
      'INSERT INTO eventos (id, lugar, fecha, estado) VALUES (?, ?, ?, ?)',
      [id, lugar, fecha, estado || 'activo']
    )
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE id = ?', [id])
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/eventos/:id - Actualizar un evento
router.put('/:id', async (req, res) => {
  try {
    const { lugar, fecha, estado } = req.body
    const pool = getDB()
    const [result] = await pool.execute(
      'UPDATE eventos SET lugar = ?, fecha = ?, estado = ? WHERE id = ?',
      [lugar, fecha, estado, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PATCH /api/eventos/:id/estado - Cambiar estado de un evento
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body
    const pool = getDB()
    const [result] = await pool.execute(
      'UPDATE eventos SET estado = ? WHERE id = ?',
      [estado, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/eventos/:id - Eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    const pool = getDB()
    const [result] = await pool.execute('DELETE FROM eventos WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    res.json({ message: 'Evento eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
