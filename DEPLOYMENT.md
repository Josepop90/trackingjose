# Guía de Deployment - Sistema de Tracking

Esta guía te ayudará a desplegar el proyecto en producción usando Railway (Backend) y Vercel (Frontend).

## 📋 Prerequisitos

- Cuenta en [Railway](https://railway.app)
- Cuenta en [Vercel](https://vercel.com)
- Base de datos PostgreSQL (puede ser en Railway o Supabase)
- Repositorio Git del proyecto

---

## 🚀 Parte 1: Deploy del Backend en Railway

### Paso 1: Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza acceso a tu repositorio
5. Selecciona el repositorio del proyecto

### Paso 2: Configurar el servicio del Backend

1. Railway detectará automáticamente que es un proyecto Node.js
2. Configura el **Root Directory** como `backend`
3. Railway usará el archivo `railway.json` que ya está configurado

### Paso 3: Configurar PostgreSQL (si no tienes base de datos)

**Opción A: Usar Railway PostgreSQL**
1. En tu proyecto de Railway, click en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente las variables de entorno

**Opción B: Usar Supabase (base de datos existente)**
1. Continúa con tus credenciales de Supabase
2. Agrega las variables de entorno manualmente (ver siguiente paso)

### Paso 4: Agregar Variables de Entorno en Railway

En la pestaña "Variables" del servicio backend, agrega:

```env
PORT=3000
DB_HOST=tu-host-postgres.railway.app (o tu host de Supabase)
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_de_postgres
DB_NAME=railway (o postgres para Supabase)
FRONTEND_URL=https://tu-app.vercel.app
JWT_SECRET=genera_un_secreto_aleatorio_aqui
```

**⚠️ IMPORTANTE:**
- Si usas Railway PostgreSQL, las variables `DB_*` se crearán automáticamente
- Para `JWT_SECRET`, genera uno aleatorio (puedes usar: `openssl rand -base64 32`)
- `FRONTEND_URL` lo obtendrás después de deployar en Vercel

### Paso 5: Deployar

1. Railway automáticamente desplegará tu backend
2. Obtén la URL de tu backend (ej: `https://tu-backend.up.railway.app`)
3. Guarda esta URL para configurar el frontend

### Paso 6: Verificar el deployment

1. Visita `https://tu-backend.up.railway.app/`
2. Deberías ver: "Backend conectado correctamente con Supabase PostgreSQL"
3. Prueba también: `https://tu-backend.up.railway.app/test-db`

---

## 🌐 Parte 2: Deploy del Frontend en Vercel

### Paso 1: Preparar Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "Add New..." → "Project"
3. Importa tu repositorio de GitHub

### Paso 2: Configurar el proyecto

1. **Root Directory:** Selecciona `frontend`
2. **Framework Preset:** Vite (Vercel lo detectará automáticamente)
3. **Build Command:** `npm run build` (ya configurado)
4. **Output Directory:** `dist` (ya configurado)

### Paso 3: Agregar Variables de Entorno

En la sección "Environment Variables" agrega:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

**⚠️ IMPORTANTE:**
- Usa la URL del backend que obtuviste en Railway
- NO olvides agregar `/api` al final
- Ejemplo: `https://tracking-backend-production.up.railway.app/api`

### Paso 4: Deployar

1. Click en "Deploy"
2. Espera a que termine el build
3. Vercel te dará una URL (ej: `https://tu-app.vercel.app`)

### Paso 5: Actualizar CORS en Railway

**¡MUY IMPORTANTE!** Ahora que tienes la URL de Vercel:

1. Ve a Railway → Tu servicio de backend → Variables
2. Actualiza la variable `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://tu-app.vercel.app
   ```
3. Railway redesplegará automáticamente el backend

---

## ✅ Verificación Final

### 1. Probar el Backend
```bash
# Debe responder con el mensaje de conexión
curl https://tu-backend.up.railway.app/

# Debe responder con la hora del servidor
curl https://tu-backend.up.railway.app/test-db
```

### 2. Probar el Frontend
1. Abre `https://tu-app.vercel.app`
2. Intenta hacer login
3. Verifica que se conecte correctamente al backend

### 3. Verificar CORS
- Si ves errores de CORS en la consola del navegador:
  - Verifica que `FRONTEND_URL` en Railway sea exactamente la URL de Vercel
  - Asegúrate de que no haya `/` al final de la URL
  - Railway debe redesplegarse después de cambiar variables

---

## 🔄 Redespliegues Futuros

### Backend (Railway)
- Los cambios se despliegan automáticamente al hacer push a la rama principal
- O manualmente desde Railway → "Deploy"

### Frontend (Vercel)
- Los cambios se despliegan automáticamente al hacer push a la rama principal
- O manualmente desde Vercel → "Deployments" → "Redeploy"

---

## 🐛 Troubleshooting

### Error: "Not allowed by CORS"
**Solución:** Verifica que `FRONTEND_URL` en Railway coincida exactamente con la URL de Vercel

### Error: "Cannot connect to database"
**Solución:** Verifica las variables de entorno `DB_*` en Railway

### Frontend no se conecta al backend
**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica que `VITE_API_URL` esté correcta
3. Ve a Vercel → Settings → Environment Variables
4. Después de cambiar variables, haz un redeploy

### Error 500 en el backend
**Solución:**
1. Ve a Railway → Tu servicio → Logs
2. Revisa los logs para identificar el error
3. Usualmente son problemas de conexión a la base de datos

---

## 📝 Variables de Entorno - Resumen

### Backend (Railway)
```env
PORT=3000
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=
FRONTEND_URL=https://tu-app.vercel.app
JWT_SECRET=
```

### Frontend (Vercel)
```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

---

## 🎉 ¡Listo!

Tu aplicación ahora está en producción:
- **Frontend:** https://tu-app.vercel.app
- **Backend:** https://tu-backend.up.railway.app
- **Base de datos:** PostgreSQL en Railway o Supabase

Para cualquier problema, revisa los logs en Railway y Vercel.
