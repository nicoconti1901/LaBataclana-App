import express from 'express'
import { getDB } from '../db.js'

const router = express.Router()

// GET /api/eventos - Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const eventos = await db.all('SELECT * FROM eventos ORDER BY fecha DESC')
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/eventos/:id - Obtener un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB()
    const evento = await db.get('SELECT * FROM eventos WHERE id = ?', [req.params.id])
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    res.json(evento)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/eventos - Crear un nuevo evento
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, fecha, lugar, precio, capacidad } = req.body
    const db = getDB()
    const result = await db.run(
      'INSERT INTO eventos (nombre, descripcion, fecha, lugar, precio, capacidad) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, fecha, lugar, precio, capacidad]
    )
    res.status(201).json({ id: result.lastID, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/eventos/:id - Actualizar un evento
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, fecha, lugar, precio, capacidad } = req.body
    const db = getDB()
    const result = await db.run(
      'UPDATE eventos SET nombre = ?, descripcion = ?, fecha = ?, lugar = ?, precio = ?, capacidad = ? WHERE id = ?',
      [nombre, descripcion, fecha, lugar, precio, capacidad, req.params.id]
    )
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    res.json({ id: req.params.id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/eventos/:id - Eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB()
    const result = await db.run('DELETE FROM eventos WHERE id = ?', [req.params.id])
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    res.json({ message: 'Evento eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
