# Enviar la tarjeta de reserva desde tu número personal – Paso a paso

Las entradas se envían por WhatsApp desde **tu número personal** (el del celular que vas a vincular). Seguí estos pasos en orden.

---

## Parte 1: En tu PC (desarrollo local)

### Paso 1.1 – Dejar solo WhatsApp por QR

1. Abrí el archivo **`backend/.env`** en el proyecto.
2. Si ves estas líneas, **borralas o comentálas** (poné `#` al inicio):
   - `WHATSAPP_ACCESS_TOKEN=...`
   - `WHATSAPP_PHONE_NUMBER_ID=...`
3. Guardá el archivo.
4. Dejá el resto del `.env` como está (DB, PORT, etc.).

---

### Paso 1.2 – Instalar dependencias e iniciar el backend

1. Abrí una terminal en la carpeta del proyecto.
2. Ejecutá:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Esperá a que aparezca:
   - `Database initialized`
   - `Server running on port 3000`
   - **No** debe aparecer el texto "usando API de Meta".
4. Dejá esta terminal abierta (el backend tiene que seguir corriendo).

---

### Paso 1.3 – Iniciar el frontend

1. Abrí **otra** terminal en la carpeta del proyecto.
2. Ejecutá:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Cuando arranque, abrí en el navegador la URL que te muestre (ej. `http://localhost:5173`).

---

### Paso 1.4 – Vincular tu WhatsApp (QR)

1. En la app del navegador, bajá hasta el **pie de página**.
2. Hacé clic en **"Vincular WhatsApp"**.
3. Debería aparecer un **código QR** en pantalla (o el mensaje "Preparando..." y a los segundos el QR).
4. En tu **celular** (el que tiene tu número personal):
   - Abrí **WhatsApp**.
   - Menú (tres puntos) → **Configuración** (o **Ajustes**).
   - **Dispositivos vinculados** → **Vincular un dispositivo**.
   - Escaneá el **QR** que ves en la pantalla de la app.
5. Cuando vincule, en la app debería decir **"Conectado"**.
6. Listo: desde ahora las entradas se envían desde ese número.

---

### Paso 1.5 – Probar el envío

1. En la app, entrá a **Eventos** y elegí un evento.
2. Abrí una reserva que tenga **número de celular**.
3. Usá la opción para **enviar la entrada por WhatsApp** (o "Enviar mensaje").
4. Revisá ese número en WhatsApp: debería llegar la imagen de la tarjeta/entrada desde **tu número personal**.

---

## Parte 2: En producción (Render)

Para que en el servidor la sesión de WhatsApp **no se pierda** en cada reinicio o deploy, hay que usar un disco persistente.

### Paso 2.1 – Crear disco persistente en Render

1. Entrá a **https://dashboard.render.com** e iniciá sesión.
2. Elegí el **servicio** que corresponde al backend de La Bataclana.
3. En el menú izquierdo, andá a **"Storage"** o **"Persistent Disks"** (o en **Settings** buscá **Persistent Disk**).
4. Clic en **"Add Disk"** o **"Create Persistent Disk"**.
5. Configurá:
   - **Name:** por ejemplo `whatsapp-session`.
   - **Size:** el mínimo (ej. 1 GB) suele alcanzar.
   - **Mount Path:** anotá la ruta que te asigne Render. Suele ser algo como:
     - `/opt/render/project/data`  
     o  
     - `/data`  
     (Render te lo muestra en pantalla; copialo).
6. Guardá / creá el disco. Render puede redeployar el servicio.

---

### Paso 2.2 – Variable de entorno para la sesión

1. En el mismo servicio del backend en Render, andá a **"Environment"** (variables de entorno).
2. Agregá una variable nueva:
   - **Key:** `WWEBJS_AUTH_PATH`
   - **Value:** la ruta del paso anterior + `/.wwebjs_auth`  
     Ejemplos:
     - Si el mount path es `/opt/render/project/data` →  
       **Value:** ` /opt/render/project/data/.wwebjs_auth`
     - Si es `/data` →  
       **Value:** `/data/.wwebjs_auth`
3. Guardá los cambios. Render va a redesplegar.

---

### Paso 2.3 – Vincular WhatsApp de nuevo (una vez en producción)

1. Después del deploy, entrá a **tu app en producción** (la URL de Vercel o donde esté el frontend).
2. En el pie de página, clic en **"Vincular WhatsApp"**.
3. Escaneá el QR con tu celular (igual que en el Paso 1.4).
4. La sesión se guarda en el disco persistente; en los próximos deploys o reinicios **no** deberías tener que escanear de nuevo (salvo que cambie la sesión o la borres).

---

## Resumen rápido

| Dónde | Qué hiciste |
|-------|-------------|
| **PC** | Sin variables de Meta en `.env` → backend usa tu número vía QR. |
| **PC** | Backend + frontend corriendo → Vincular WhatsApp → escaneás el QR con tu celular. |
| **PC** | Enviás una entrada desde la app → llega desde tu número personal. |
| **Render** | Disco persistente + `WWEBJS_AUTH_PATH` → la sesión sobrevive al reinicio. |
| **Producción** | Una vez deployado, entrás a la app y vinculás WhatsApp de nuevo (solo la primera vez o si se pierde la sesión). |

Si en algún paso algo no coincide con lo que ves (por ejemplo en Render no aparece "Persistent Disk"), decime en qué paso estás y qué pantalla tenés y lo adaptamos.