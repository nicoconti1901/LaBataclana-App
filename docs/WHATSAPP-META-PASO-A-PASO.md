# WhatsApp – Dos opciones

## ¿Desde qué número querés enviar?

| Opción | Número desde el que se envía | Cuándo usarla |
|--------|------------------------------|----------------|
| **whatsapp-web.js (QR)** | **Tu número personal** (el del celular que escaneás) | Si querés que la tarjeta de reserva llegue desde tu WhatsApp personal. |
| **API de Meta** | Un número exclusivo para la app (no puede ser el que ya usás en WhatsApp) | Si más adelante tenés otro número/SIM para “La Bataclana” y preferís la API oficial. |

**Para enviar desde tu número personal:** no configures `WHATSAPP_ACCESS_TOKEN` ni `WHATSAPP_PHONE_NUMBER_ID`. Usá la app → Vincular WhatsApp → escaneá el QR con ese celular. Las entradas saldrán de ese número.

---

# WhatsApp con la API de Meta – Paso a paso (opcional)

Esta guía es solo si querés usar un **segundo número** (no el personal) con la API oficial de Meta.

---

## Paso 1: Cuenta de Meta for Developers

1. Entrá a **https://developers.facebook.com**
2. Iniciá sesión con tu cuenta de Facebook (o creá una).
3. Si es la primera vez, aceptá los términos de “Meta for Developers”.

---

## Paso 2: Crear una app

1. En el menú superior: **Mis apps** → **Crear app**.
2. Elegí **Otro** (o “Utilidad” si aparece) → **Siguiente**.
3. Nombre de la app: por ejemplo **La Bataclana**.
4. Email de contacto: tu correo.
5. **Crear app**.
6. Cuando pregunte “¿Qué quieres hacer con tu app?”, elegí **Configurar integraciones de negocio** (o “Business”) → **Siguiente** → **Crear**.

---

## Paso 3: Agregar WhatsApp a la app

1. En el panel de tu app, buscá **WhatsApp** en “Agregar productos” o en el menú.
2. Clic en **WhatsApp** → **Configurar** (o “Set up”).
3. Te va a llevar a la sección de WhatsApp. Ahí vas a ver:
   - **API Setup** (configuración de la API)
   - Número de teléfono de prueba o la opción de usar tu propio número

---

## Paso 4: Número de teléfono (WhatsApp Business)

Tienes dos caminos:

### Opción A: Número de prueba (solo desarrollo)

- Meta te da un número de prueba y un destinatario de prueba.
- Sirve para probar sin verificar negocio.
- **Limitación:** solo podés enviar a los números que Meta te indique como “destinatarios de prueba”.

### Opción B: Tu propio número (producción)

1. Necesitás una **Cuenta de negocio de Meta** (Meta Business Suite).
2. En **WhatsApp** → **Configuración de la API** (o “API Setup”).
3. Sección **Desde** (o “From”): ahí se configura el número.
4. Podés:
   - Añadir un número que tengas (te enviarán un código por WhatsApp para verificarlo), o
   - Usar el número de prueba mientras tanto.

Anotá en un papel o en un archivo:

- El **ID del número de teléfono** (Phone number ID) – un número largo.
- El **Token de acceso** (Access token) que se muestra en esa misma pantalla.

---

## Paso 5: Token de acceso (permanente para producción)

El token que ves en la pantalla suele ser **temporal** (1 hora).

Para producción (Render, 24/7) conviene un token **permanente**:

1. En el panel de la app: **Configuración** (engranaje) → **Básica**.
2. Anotá el **ID de la app** y el **Secreto de la app** (mostrar y copiar).
3. Para un token permanente se usa un **Usuario del sistema** (System User) en Meta Business Suite:
   - Entrá a **business.facebook.com** → tu cuenta de negocio.
   - **Configuración del negocio** → **Usuarios** → **Usuarios del sistema**.
   - Crear usuario del sistema (nombre ej. “La Bataclana Backend”).
   - Asignale la app y el permiso **whatsapp_business_messaging**.
   - Generar token para esa app → permisos: `whatsapp_business_messaging`, `whatsapp_business_management`.
   - Ese token puede ser “Never expire” (no expira).

Si al principio usás el token temporal, la app va a funcionar; cuando expire, tendrás que pegar el nuevo token en Render hasta que configures el permanente.

---

## Paso 6: Variables de entorno en tu PC (probar en local)

En la carpeta del proyecto, archivo **backend/.env**, agregá (o completá):

```env
# WhatsApp Cloud API (Meta)
WHATSAPP_ACCESS_TOKEN=el_token_que_copiaste
WHATSAPP_PHONE_NUMBER_ID=el_phone_number_id_que_copiaste
```

- Sin espacios alrededor del `=`.
- No pongas comillas en el valor.

Reiniciá el backend. En la consola debería aparecer algo como: **WhatsApp: usando API de Meta (Cloud API)**.

---

## Paso 7: Probar envío en local

1. Backend corriendo: `cd backend && npm run dev`
2. Frontend corriendo: `cd frontend && npm run dev`
3. En la app: entrá a un evento → reservas → elegí una reserva con celular.
4. **Enviar entrada por WhatsApp**. Debería enviarse usando la API de Meta.

Si usás **número de prueba**, el destinatario debe ser uno de los números de prueba que Meta te muestra en **WhatsApp → API Setup** (sección “To” / destinatarios de prueba). Si usás tu propio número verificado, podés enviar a cualquier número.

---

## Paso 8: Variables en Render (producción)

1. Entrá al **dashboard de Render** → tu servicio del backend.
2. **Environment** (o “Environment Variables”).
3. Agregá:
   - **Key:** `WHATSAPP_ACCESS_TOKEN`  
     **Value:** (tu token, idealmente el permanente)
   - **Key:** `WHATSAPP_PHONE_NUMBER_ID`  
     **Value:** (el Phone number ID del Paso 4)
4. Guardá. Render va a redesplegar solo.

Después de eso, en producción también se usará la API de Meta para enviar las entradas.

---

## Resumen de qué tenés que tener

| Dónde | Qué |
|-------|-----|
| Meta for Developers | App creada, producto WhatsApp configurado |
| API Setup (WhatsApp) | **Phone number ID** y **Access token** |
| .env (local) y Render (producción) | `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` |

---

## Errores frecuentes

- **“WhatsApp Meta no configurado”**  
  Faltan `WHATSAPP_ACCESS_TOKEN` o `WHATSAPP_PHONE_NUMBER_ID` en el .env o en Render.

- **401 / token inválido**  
  Token expirado (si es temporal) o mal copiado. Generá uno nuevo y actualizá.

- **Solo puedo enviar a un número**  
  Estás en modo “número de prueba”. Para enviar a cualquier número hay que verificar el negocio y usar tu propio número.

- **“Número de teléfono inválido”**  
  El número debe tener código de país (ej. Argentina 54). En la app ya se normaliza a 549…; si falla, revisá que el celular de la reserva tenga 10 dígitos + código país.

Si en algún paso te traba la interfaz de Meta o no encontrás “Phone number ID” o “Access token”, decime en qué paso estás y qué ves en pantalla y lo vemos puntual.