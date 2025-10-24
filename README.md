# 📱 Sistema de Tracking - Reparaciones

Sistema completo para gestión y seguimiento de órdenes de reparación con tracking público para clientes.

## 🏗️ Arquitectura

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (Supabase/Railway)
- **Autenticación:** JWT

## 📁 Estructura del Proyecto

```
tracking-main/
├── backend/              # API REST con Node.js
│   ├── routes/          # Rutas de la API
│   ├── index.js         # Punto de entrada del servidor
│   ├── db.js            # Configuración de PostgreSQL
│   └── .env.example     # Variables de entorno de ejemplo
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── services/    # Servicios API
│   │   └── contexts/    # Contextos de React
│   └── .env.example     # Variables de entorno de ejemplo
└── DEPLOYMENT.md        # Guía de deployment
```

## 🚀 Inicio Rápido - Desarrollo Local

### Prerequisitos

- Node.js 18+ instalado
- PostgreSQL (local o Supabase)
- Git

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd tracking-main
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` basado en `.env.example`:

```env
PORT=3000
DB_HOST=tu-host.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=postgres
FRONTEND_URL=http://localhost:5173
JWT_SECRET=tu_secreto_jwt
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

### 3. Configurar Frontend

Abre una nueva terminal:

```bash
cd frontend
npm install
```

Crea el archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

Inicia el frontend:

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🌐 Deployment a Producción

Para desplegar el proyecto en producción, sigue la guía detallada en [DEPLOYMENT.md](./DEPLOYMENT.md)

**Resumen:**
- **Backend:** Railway
- **Frontend:** Vercel
- **Base de datos:** PostgreSQL en Railway o Supabase

## 🔐 Variables de Entorno

### Backend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `db.example.com` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | `password123` |
| `DB_NAME` | Nombre de la BD | `postgres` |
| `FRONTEND_URL` | URL del frontend (para CORS) | `https://app.vercel.app` |
| `JWT_SECRET` | Secreto para JWT | `random_secret_here` |

### Frontend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | `https://api.railway.app/api` |

## 📦 Scripts Disponibles

### Backend

```bash
npm run dev      # Inicia el servidor en modo desarrollo con nodemon
npm start        # Inicia el servidor en modo producción
npm run prod     # Inicia con NODE_ENV=production
```

### Frontend

```bash
npm run dev      # Inicia Vite dev server
npm run build    # Genera build de producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecuta ESLint
```

## 🛠️ Tecnologías Utilizadas

### Backend
- Express.js - Framework web
- PostgreSQL (pg) - Base de datos
- JWT - Autenticación
- Bcrypt - Hash de contraseñas
- CORS - Cross-Origin Resource Sharing
- Dotenv - Variables de entorno

### Frontend
- React 19 - UI Library
- Vite - Build tool
- React Router DOM - Navegación
- Axios - Cliente HTTP
- TailwindCSS - Estilos
- Lucide React - Iconos
- QRCode.react - Generación de códigos QR
- React-to-print - Impresión de tickets

## 📋 Funcionalidades Principales

- ✅ Autenticación con JWT
- ✅ Gestión de usuarios y roles
- ✅ CRUD de clientes
- ✅ CRUD de dispositivos
- ✅ CRUD de órdenes de reparación
- ✅ Historial de cambios de estado
- ✅ Tracking público para clientes
- ✅ Generación de tickets con QR
- ✅ Reportes y estadísticas
- ✅ Gestión de marcas y modelos

## 🔒 Roles y Permisos

El sistema cuenta con diferentes roles de usuario:
- **Admin:** Acceso completo al sistema
- **Técnico:** Gestión de reparaciones
- **Recepcionista:** Registro de órdenes y clientes

## 🐛 Troubleshooting

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` esté correcta en el `.env`
- Asegúrate de que el backend esté corriendo
- Revisa la consola del navegador para errores

### Error de CORS
- Verifica que `FRONTEND_URL` en el backend incluya la URL correcta del frontend
- En desarrollo debe ser `http://localhost:5173`
- Puedes agregar múltiples URLs separadas por comas

### Error de conexión a la base de datos
- Verifica las credenciales en el `.env` del backend
- Asegúrate de que PostgreSQL esté corriendo
- Verifica que las tablas estén creadas

## 📄 Licencia

ISC

## 👥 Contribuidores

Este es un proyecto en grupo. Para contribuir:

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, abre un issue en el repositorio.
