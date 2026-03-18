/**
 * Script para crear la base de datos local y las tablas.
 * Útil cuando clonás el proyecto en una PC nueva.
 *
 * Requisitos: MySQL instalado y corriendo localmente.
 *
 * Uso: node scripts/setup-local-db.js
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3308,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bataclana_app'
}

async function setupLocalDB() {
  console.log('🔧 Configurando base de datos local...\n')

  // 1. Conectar sin base de datos para crearla
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password
  })

  try {
    // 2. Crear la base de datos si no existe
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    console.log(`✅ Base de datos "${config.database}" lista\n`)

    // 3. Usar la base y crear tablas
    await connection.changeUser({ database: config.database })

    // Tabla eventos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS eventos (
        id CHAR(36) PRIMARY KEY,
        lugar VARCHAR(150) NOT NULL,
        direccion VARCHAR(255),
        fecha DATE NOT NULL,
        estado VARCHAR(20) DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('  ✓ Tabla eventos')

    // Columna direccion (por si ya existía la tabla sin ella)
    try {
      await connection.execute(`
        ALTER TABLE eventos ADD COLUMN direccion VARCHAR(255) AFTER lugar
      `)
    } catch (e) {
      if (!e.message.includes('Duplicate column name')) console.warn('  ⚠', e.message)
    }

    // Tabla gastos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS gastos (
        id CHAR(36) PRIMARY KEY,
        evento_id CHAR(36) NOT NULL,
        concepto VARCHAR(255) NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
      )
    `)
    console.log('  ✓ Tabla gastos')

    // Tabla reservas
    await connection.execute(`
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
        CONSTRAINT fk_evento FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
        CONSTRAINT uq_evento_sorteo UNIQUE (evento_id, numero_sorteo),
        CONSTRAINT chk_forma_pago CHECK (forma_pago IN ('transferencia', 'efectivo')),
        CONSTRAINT chk_sorteo_rango CHECK (numero_sorteo BETWEEN 1 AND 100)
      )
    `)
    console.log('  ✓ Tabla reservas')

    console.log('\n✅ Base de datos local lista. Podés ejecutar: npm start')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.error('\n   ¿Tenés MySQL instalado y corriendo?')
      console.error('   Puertos comunes: 3306 (default) o 3308')
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n   Revisá usuario y contraseña en el archivo .env')
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

setupLocalDB()
