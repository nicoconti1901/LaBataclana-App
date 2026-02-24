#!/usr/bin/env node
/**
 * Quita el fondo negro del logo y lo guarda con transparencia.
 * Uso: node scripts/remove-logo-bg.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputPath = path.join(__dirname, '../frontend/src/assets/logofinal.png')
const outputPath = path.join(__dirname, '../frontend/src/assets/logofinal-transparent.png')

const BLACK_THRESHOLD = 40 // Píxeles con R,G,B < 40 se consideran fondo negro

async function removeBlackBackground() {
  const image = sharp(inputPath)
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const newData = Buffer.alloc(data.length)

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = channels === 4 ? data[i + 3] : 255

    const isBlack = r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD
    const newAlpha = isBlack ? 0 : a

    newData[i] = r
    newData[i + 1] = g
    newData[i + 2] = b
    newData[channels === 4 ? i + 3 : i + 3] = newAlpha
  }

  await sharp(newData, {
    raw: { width, height, channels: 4 }
  })
    .png()
    .toFile(outputPath)

  console.log('✅ Logo guardado en:', outputPath)
  console.log('   Reemplazá logofinal.png por logofinal-transparent.png en el código, o renombrá el archivo.')
}

removeBlackBackground().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
