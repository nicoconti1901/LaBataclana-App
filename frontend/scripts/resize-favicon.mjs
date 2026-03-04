import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const input = join(publicDir, 'icono.png');
const fallback = join(publicDir, '../src/assets/Logo.png');

const src = existsSync(input) ? input : existsSync(fallback) ? fallback : null;
if (!src) {
  console.error('No se encontró icono.png ni Logo.png');
  process.exit(1);
}

const metadata = await sharp(src).metadata();
const { width, height } = metadata;
// Recortar bordes para "zoom" y que el contenido ocupe más (60% = más zoom)
const crop = Math.min(width, height) * 0.8;
const left = Math.floor((width - crop) / 2);
const top = Math.floor((height - crop) / 2);

const sizes = [32, 64, 180];
for (const size of sizes) {
  await sharp(src)
    .extract({ left, top, width: Math.floor(crop), height: Math.floor(crop) })
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `favicon-${size}.png`));
  console.log(`Creado favicon-${size}.png`);
}
