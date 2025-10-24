# 📂 ESTRUCTURA DEL PROYECTO - Frontend

## 🌳 Árbol de Directorios

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx              ✨ NUEVO - Protección de rutas
│   │   ├── layout/
│   │   │   ├── DynamicSidebar.jsx              ✨ NUEVO - Sidebar dinámico
│   │   │   ├── Header.jsx                      ✅ Existente
│   │   │   ├── MainLayout.jsx                  🔴 Antiguo (no tocar)
│   │   │   ├── NewMainLayout.jsx               ✨ NUEVO - Layout con DynamicSidebar
│   │   │   └── Sidebar.jsx                     🔴 Antiguo (no tocar)
│   │   └── shared/
│   │       ├── DataTable.jsx                   ✨ NUEVO - Tabla reutilizable
│   │       └── StatsCard.jsx                   ✨ NUEVO - Tarjeta de estadísticas
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx                     ✨ NUEVO - Context de autenticación
│   │
│   ├── hooks/
│   │   └── usePermissions.js                   ✨ NUEVO - Hook de permisos
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx              🔴 Antiguo (no tocar)
│   │   │   ├── Clientes.jsx                    🔴 Antiguo (vacío)
│   │   │   ├── Ordenes.jsx                     🔴 Antiguo (vacío)
│   │   │   └── Usuarios.jsx                    🔴 Antiguo (vacío)
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx               ✨ NUEVO - Dashboard universal
│   │   ├── login/
│   │   │   ├── LoginPage.jsx                   🔴 Antiguo (no tocar)
│   │   │   └── NewLoginPage.jsx                ✨ NUEVO - Login con AuthContext
│   │   ├── recepcion/                          🔴 Antiguo (vacío)
│   │   ├── tecnico/                            🔴 Antiguo (vacío)
│   │   └── AccesoDenegado.jsx                  ✨ NUEVO - Página 403
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx                       🔴 Antiguo (no tocar)
│   │   └── NewAppRouter.jsx                    ✨ NUEVO - Router con permisos
│   │
│   ├── services/
│   │   └── api.js                              ✅ Actualizado con interceptor
│   │
│   ├── utils/
│   │   └── permissions.js                      ✨ NUEVO - Sistema de permisos
│   │
│   ├── App.jsx                                 📝 Modificar aquí para activar
│   └── main.jsx                                ✅ Existente
│
├── COMO_ACTIVAR.md                             📄 Guía de activación rápida
├── GUIA_MIGRACION.md                           📄 Guía completa
├── ANTES_Y_DESPUES.md                          📄 Comparación detallada
├── RESUMEN_EJECUTIVO.md                        📄 Resumen ejecutivo
├── ESTRUCTURA_PROYECTO.md                      📄 Este archivo
└── package.json                                ✅ Existente
```

---

## 🎨 LEYENDA

| Símbolo | Significado |
|---------|-------------|
| ✨ | Archivo nuevo (sistema moderno) |
| ✅ | Archivo existente actualizado |
| 🔴 | Archivo antiguo (NO TOCAR - para rollback) |
| 📝 | Archivo a modificar para activar |
| 📄 | Documentación |

---

## 📋 ARCHIVOS POR CATEGORÍA

### 1. SISTEMA DE PERMISOS
```
✨ src/utils/permissions.js                    - Define permisos por rol
✨ src/hooks/usePermissions.js                 - Hook para verificar permisos
✨ src/components/auth/ProtectedRoute.jsx      - Componente de protección
```

**Función**: Controlar qué puede ver/hacer cada rol

---

### 2. AUTENTICACIÓN
```
✨ src/contexts/AuthContext.jsx                - Context de autenticación
✨ src/pages/login/NewLoginPage.jsx            - Login actualizado
✅ src/services/api.js                         - API con interceptor de token
```

**Función**: Manejar login, logout y estado del usuario

---

### 3. COMPONENTES UI
```
✨ src/components/layout/DynamicSidebar.jsx    - Sidebar que se adapta al rol
✨ src/components/layout/NewMainLayout.jsx     - Layout con DynamicSidebar
✨ src/components/shared/StatsCard.jsx         - Tarjeta de estadísticas
✨ src/components/shared/DataTable.jsx         - Tabla reutilizable
```

**Función**: Interfaz visual adaptativa

---

### 4. PÁGINAS
```
✨ src/pages/dashboard/DashboardPage.jsx       - Dashboard universal
✨ src/pages/AccesoDenegado.jsx                - Página de error 403
```

**Función**: Contenido principal de la aplicación

---

### 5. ROUTING
```
✨ src/routes/NewAppRouter.jsx                 - Router con rutas protegidas
```

**Función**: Navegación con seguridad

---

### 6. DOCUMENTACIÓN
```
📄 COMO_ACTIVAR.md                             - Activación en 2 minutos
📄 GUIA_MIGRACION.md                           - Guía completa
📄 ANTES_Y_DESPUES.md                          - Comparación visual
📄 RESUMEN_EJECUTIVO.md                        - Resumen ejecutivo
📄 ESTRUCTURA_PROYECTO.md                      - Este archivo
```

**Función**: Documentación del sistema

---

## 🔄 FLUJO DE ARCHIVOS

### Flujo de Autenticación

```
1. NewLoginPage.jsx
       ↓
2. AuthContext.jsx (guarda usuario y token)
       ↓
3. NewAppRouter.jsx (redirige a /dashboard)
       ↓
4. ProtectedRoute.jsx (valida que esté autenticado)
       ↓
5. NewMainLayout.jsx (muestra layout)
       ↓
6. DynamicSidebar.jsx (muestra menú según rol)
       ↓
7. DashboardPage.jsx (muestra contenido según rol)
```

### Flujo de Permisos

```
1. permissions.js (define permisos por rol)
       ↓
2. usePermissions.js (hook para verificar permisos)
       ↓
3. ProtectedRoute.jsx (usa hook para proteger rutas)
       ↓
4. DynamicSidebar.jsx (usa hook para filtrar menú)
       ↓
5. DashboardPage.jsx (usa hook para mostrar contenido)
```

### Flujo de API

```
1. Componente hace petición: api.get("/ordenes")
       ↓
2. api.js interceptor agrega token automáticamente
       ↓
3. Backend recibe petición con token
       ↓
4. Backend valida token y permisos
       ↓
5. Backend responde con datos
       ↓
6. api.js interceptor maneja errores (401, etc)
       ↓
7. Componente recibe datos
```

---

## 📦 DEPENDENCIAS ENTRE ARCHIVOS

### AuthContext.jsx depende de:
- `services/api.js` - Para hacer login
- `react-router-dom` - Para navigate

### usePermissions.js depende de:
- `contexts/AuthContext.jsx` - Para obtener rol del usuario
- `utils/permissions.js` - Para verificar permisos

### ProtectedRoute.jsx depende de:
- `contexts/AuthContext.jsx` - Para verificar autenticación
- `hooks/usePermissions.js` - Para verificar permisos

### DynamicSidebar.jsx depende de:
- `hooks/usePermissions.js` - Para filtrar menú
- `utils/permissions.js` - Para conocer recursos

### DashboardPage.jsx depende de:
- `hooks/usePermissions.js` - Para adaptar contenido
- `components/shared/StatsCard.jsx` - Para mostrar estadísticas
- `services/api.js` - Para obtener datos

### NewAppRouter.jsx depende de:
- `contexts/AuthContext.jsx` - Para proveer autenticación
- `components/auth/ProtectedRoute.jsx` - Para proteger rutas
- Todas las páginas y layouts

---

## 🎯 ARCHIVOS CLAVE PARA MODIFICAR

### Para Agregar Nuevo Recurso:

1. **permissions.js** - Agregar recurso y permisos
2. **DynamicSidebar.jsx** - Agregar opción al menú
3. **NewAppRouter.jsx** - Agregar ruta protegida
4. Crear la página del recurso

### Para Agregar Nuevo Rol:

1. **permissions.js** - Definir permisos del rol
2. Listo (todo lo demás es automático)

### Para Modificar Permisos:

1. **permissions.js** - Editar objeto PERMISSIONS
2. Listo (todo lo demás es automático)

---

## 🔒 ARCHIVOS QUE NO SE DEBEN TOCAR

Estos archivos son del sistema antiguo y se mantienen para rollback:

```
🔴 src/components/layout/MainLayout.jsx
🔴 src/components/layout/Sidebar.jsx
🔴 src/pages/admin/AdminDashboard.jsx
🔴 src/pages/login/LoginPage.jsx
🔴 src/routes/AppRouter.jsx
```

**No eliminarlos ni modificarlos** - Son el backup si necesitas volver atrás.

---

## 📊 TAMAÑO DE ARCHIVOS

| Archivo | Líneas | Complejidad |
|---------|--------|-------------|
| permissions.js | 150 | Baja |
| AuthContext.jsx | 90 | Media |
| usePermissions.js | 110 | Baja |
| ProtectedRoute.jsx | 50 | Baja |
| DynamicSidebar.jsx | 135 | Media |
| DashboardPage.jsx | 305 | Alta |
| NewAppRouter.jsx | 125 | Media |
| StatsCard.jsx | 35 | Baja |
| DataTable.jsx | 60 | Baja |

**Total nuevo**: ~1,060 líneas
**Total reemplazado**: ~600 líneas duplicadas

**Reducción neta**: Ganancia de calidad sin aumentar código

---

## 🚀 PRÓXIMOS ARCHIVOS A CREAR

### Páginas Pendientes:
```
src/pages/dashboard/
├── UsuariosPage.jsx           - Gestión de usuarios
├── ClientesPage.jsx           - Gestión de clientes
├── DispositivosPage.jsx       - Gestión de dispositivos
├── OrdenesPage.jsx            - Gestión de órdenes
├── ReparacionesPage.jsx       - Gestión de reparaciones
├── HistorialPage.jsx          - Historial
├── ReportesPage.jsx           - Reportes
└── ConfiguracionPage.jsx      - Configuración
```

### Componentes Adicionales:
```
src/components/shared/
├── FormModal.jsx              - Modal para formularios
├── ConfirmDialog.jsx          - Diálogo de confirmación
├── SearchBar.jsx              - Barra de búsqueda
├── Pagination.jsx             - Paginación
└── Loading.jsx                - Indicador de carga
```

---

## 📚 ORDEN DE LECTURA RECOMENDADO

Para entender el sistema:

1. **RESUMEN_EJECUTIVO.md** - Visión general (5 min)
2. **COMO_ACTIVAR.md** - Activar sistema (2 min)
3. **ESTRUCTURA_PROYECTO.md** - Este archivo (5 min)
4. **permissions.js** - Ver cómo funcionan permisos (10 min)
5. **usePermissions.js** - Ver el hook (5 min)
6. **DashboardPage.jsx** - Ver dashboard universal (15 min)
7. **ANTES_Y_DESPUES.md** - Comparaciones detalladas (15 min)
8. **GUIA_MIGRACION.md** - Guía completa (20 min)

**Total**: ~77 minutos para entender todo el sistema

---

## 🎓 CONCEPTOS CLAVE

### 1. Permission-Based Architecture
- Los permisos controlan TODO
- Un solo dashboard se adapta según permisos
- Sidebar se filtra automáticamente

### 2. Context API
- AuthContext mantiene estado global
- Evita prop drilling
- Disponible en toda la app

### 3. Protected Routes
- ProtectedRoute valida antes de mostrar
- Redirige si no hay permiso
- Seguridad en cada ruta

### 4. Component Reusability
- StatsCard usado por todos
- DataTable compartida
- DRY principle aplicado

### 5. Separation of Concerns
- permissions.js = lógica de permisos
- AuthContext = lógica de autenticación
- Components = UI
- Pages = contenido

---

## ✨ CONCLUSIÓN

Esta estructura representa un sistema:

✅ **Modular** - Cada archivo tiene una responsabilidad
✅ **Escalable** - Fácil agregar features
✅ **Mantenible** - Código organizado y documentado
✅ **Seguro** - Permisos en cada nivel
✅ **Profesional** - Siguiendo mejores prácticas

**Todo está listo para activar con un solo cambio en App.jsx**
