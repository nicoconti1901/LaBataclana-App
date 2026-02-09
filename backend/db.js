import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { promisify } from 'util'

let db = null

export async function initDB() {
  if (db) return db

  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })

  // Crear tablas si no existen
  await db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      fecha TEXT NOT NULL,
      lugar TEXT,
      precio REAL,
      capacidad INTEGER,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      codigo TEXT UNIQUE NOT NULL,
      numero_sorteo INTEGER,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evento_id) REFERENCES eventos(id)
    );
  `)

  return db
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.')
  }
  return db
}

export default { initDB, getDB }
