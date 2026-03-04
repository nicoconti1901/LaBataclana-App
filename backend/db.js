import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let pool = null

function getSSLConfig() {
  // Aiven requiere SSL. Usar DB_SSL_CA (contenido del cert) o ruta a ca.pem
  const caContent = process.env.DB_SSL_CA
  if (caContent) {
    return { ca: caContent, rejectUnauthorized: true }
  }
  const caPath = path.join(__dirname, 'ca.pem')
  if (fs.existsSync(caPath)) {
    return { ca: fs.readFileSync(caPath).toString(), rejectUnauthorized: true }
  }
  // Si no hay cert, intentar SSL básico (puede fallar en Aiven)
  return process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined
}

export async function initDB() {
  if (pool) return pool

  const ssl = getSSLConfig()
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bataclana_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...(ssl && { ssl })
  })

  // Crear tablas si no existen
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS eventos (
      id CHAR(36) PRIMARY KEY,
      lugar VARCHAR(150) NOT NULL,
      direccion VARCHAR(255),
      fecha DATE NOT NULL,
      estado VARCHAR(20) DEFAULT 'activo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Agregar columna direccion si no existe (para tablas ya creadas)
  try {
    await pool.execute(`
      ALTER TABLE eventos 
      ADD COLUMN direccion VARCHAR(255) AFTER lugar
    `)
  } catch (error) {
    // La columna ya existe o hay otro error, ignorar silenciosamente
    if (!error.message.includes('Duplicate column name')) {
      console.warn('Warning adding direccion column:', error.message)
    }
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS gastos (
      id CHAR(36) PRIMARY KEY,
      evento_id CHAR(36) NOT NULL,
      concepto VARCHAR(255) NOT NULL,
      monto DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
    )
  `)

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS reservas (
      id CHAR(36) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      celular VARCHAR(20) NOT NULL,
      pago BOOLEAN DEFAULT FALSE,
      forma_pago VARCHAR(20),
      consumicion BOOLEAN DEFAULT FALSE,
      importe DECIMAL(10,2),
      numero_sorteo INT NOT NULL,
      evento_id CHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_evento
        FOREIGN KEY (evento_id)
        REFERENCES eventos(id)
        ON DELETE CASCADE,
      CONSTRAINT uq_evento_sorteo
        UNIQUE (evento_id, numero_sorteo),
      CONSTRAINT chk_forma_pago
        CHECK (forma_pago IN ('transferencia', 'efectivo')),
      CONSTRAINT chk_sorteo_rango
        CHECK (numero_sorteo BETWEEN 1 AND 100)
    )
  `)
  try {
    await pool.execute(`
      ALTER TABLE reservas 
      ADD COLUMN entrada_enviada BOOLEAN DEFAULT FALSE
    `)
  } catch (error) {
    if (!error.message.includes('Duplicate column name')) {
      console.warn('Warning adding entrada_enviada:', error.message)
    }
  }

  console.log('MySQL tables ready')
  return pool
}

export function getDB() {
  if (!pool) {
    throw new Error('Database not initialized. Call initDB() first.')
  }
  return pool
}

export default { initDB, getDB }
