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

## Desarrollo

El proyecto está configurado para desarrollo con hot-reload tanto en frontend como backend.
