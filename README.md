# La Bataclana App

Aplicación web para gestión de eventos y reservas con integración de WhatsApp.

## Estructura del Proyecto

```
├─ /frontend          # Aplicación React con Vite
│   ├─ /src
│   │   ├─ /pages     # Páginas de la aplicación
│   │   ├─ /components # Componentes reutilizables
│   │   ├─ /services  # Servicios para comunicación con API
│   │   ├─ /utils     # Utilidades y helpers
│   │   ├─ router.jsx # Configuración de rutas
│   │   ├─ App.jsx
│   │   └─ main.jsx
│   └─ index.html
├─ /backend           # API REST con Express
│   ├─ index.js       # Servidor principal
│   ├─ db.js          # Configuración de base de datos
│   ├─ /routes        # Rutas de la API
│   ├─ /services      # Servicios (WhatsApp, imágenes)
│   └─ .env           # Variables de entorno
└─ README.md
```

## Instalación

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Tecnologías

### Frontend
- React 19
- React Router DOM
- Vite

### Backend
- Node.js
- Express
- SQLite
- CORS

## Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database.sqlite
```

## API Endpoints

### Eventos
- `GET /api/eventos` - Obtener todos los eventos
- `GET /api/eventos/:id` - Obtener un evento por ID
- `POST /api/eventos` - Crear un nuevo evento
- `PUT /api/eventos/:id` - Actualizar un evento
- `DELETE /api/eventos/:id` - Eliminar un evento

### Reservas
- `GET /api/reservas` - Obtener todas las reservas
- `GET /api/reservas/:id` - Obtener una reserva por ID
- `GET /api/reservas/evento/:eventoId` - Obtener reservas de un evento
- `POST /api/reservas` - Crear una nueva reserva

## WhatsApp: API de Meta (recomendado en producción)

Para usar la **API oficial de WhatsApp** (Meta / Facebook) en producción:

1. **Meta for Developers:** Crear una app en [developers.facebook.com](https://developers.facebook.com), agregar el producto **WhatsApp** y completar el flujo (cuenta de negocio, número de teléfono, etc.).
2. **Variables de entorno en el backend** (Render o donde esté hosteado):
   - `WHATSAPP_ACCESS_TOKEN` – Token de acceso permanente (desde Meta → WhatsApp → API Setup).
   - `WHATSAPP_PHONE_NUMBER_ID` – ID del número de teléfono (en la misma sección).
3. Opcional: `WHATSAPP_API_VERSION` (por defecto `21.0`).

Con eso, el backend usa la Cloud API para enviar las entradas; no hace falta escanear QR ni disco persistente.

---

## WhatsApp con whatsapp-web.js (solo desarrollo local)

Si **no** configurás las variables de Meta, el backend usa whatsapp-web.js (QR en `/vincular-whatsapp`). En Render, para que la sesión no se pierda en cada reinicio:

1. **Disco persistente:** Settings → Persistent Disk, montar ej. en `/data`.
2. **Variable:** `WWEBJS_AUTH_PATH=/data/.wwebjs_auth`.
3. Escanear el QR desde la app (Vincular WhatsApp) la primera vez.
