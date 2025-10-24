// Sistema de permisos granulares para roles
// Define qué recursos y acciones puede realizar cada rol

// Roles del sistema
export const ROLES = {
  ADMIN: "Administrador",
  RECEPCIONISTA: "Recepcionista",
  TECNICO: "Técnico",
};

// Recursos del sistema
export const RESOURCES = {
  DASHBOARD: "dashboard",
  USUARIOS: "usuarios",
  CLIENTES: "clientes",
  DISPOSITIVOS: "dispositivos",
  ORDENES: "ordenes",
  REPARACIONES: "reparaciones",
  HISTORIAL: "historial",
  CONFIGURACION: "configuracion",
  REPORTES: "reportes",
};

// Acciones posibles
export const ACTIONS = {
  VIEW: "view",      // Ver/Listar
  CREATE: "create",  // Crear
  EDIT: "edit",      // Editar
  DELETE: "delete",  // Eliminar
  ASSIGN: "assign",  // Asignar (técnicos, órdenes)
  CLOSE: "close",    // Cerrar órdenes
};

// Matriz de permisos: Define qué puede hacer cada rol sobre cada recurso
export const PERMISSIONS = {
  // ADMINISTRADOR - Acceso total
  [ROLES.ADMIN]: {
    [RESOURCES.DASHBOARD]: [ACTIONS.VIEW],
    [RESOURCES.USUARIOS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [RESOURCES.CLIENTES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [RESOURCES.DISPOSITIVOS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [RESOURCES.ORDENES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.ASSIGN, ACTIONS.CLOSE],
    [RESOURCES.REPARACIONES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.ASSIGN],
    [RESOURCES.HISTORIAL]: [ACTIONS.VIEW],
    [RESOURCES.CONFIGURACION]: [ACTIONS.VIEW, ACTIONS.EDIT],
    [RESOURCES.REPORTES]: [ACTIONS.VIEW],
  },

  // RECEPCIONISTA - Gestión de clientes, dispositivos y órdenes
  [ROLES.RECEPCIONISTA]: {
    [RESOURCES.DASHBOARD]: [ACTIONS.VIEW],
    [RESOURCES.CLIENTES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [RESOURCES.DISPOSITIVOS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [RESOURCES.ORDENES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // No puede cerrar ni eliminar
    [RESOURCES.HISTORIAL]: [ACTIONS.VIEW],
  },

  // TÉCNICO - Gestión de reparaciones solamente
  [ROLES.TECNICO]: {
    [RESOURCES.DASHBOARD]: [ACTIONS.VIEW],
    [RESOURCES.REPARACIONES]: [ACTIONS.VIEW, ACTIONS.EDIT, ACTIONS.CLOSE],
    [RESOURCES.HISTORIAL]: [ACTIONS.VIEW],
  },
};

/**
 * Verifica si un rol tiene permiso para realizar una acción sobre un recurso
 * @param {string} role - Rol del usuario (ej: "Administrador")
 * @param {string} resource - Recurso a verificar (ej: "usuarios")
 * @param {string} action - Acción a realizar (ej: "create")
 * @returns {boolean} true si tiene permiso, false si no
 */
export const hasPermission = (role, resource, action) => {
  if (!role || !resource || !action) return false;

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
};

/**
 * Verifica si un rol puede acceder a un recurso (cualquier acción)
 * @param {string} role - Rol del usuario
 * @param {string} resource - Recurso a verificar
 * @returns {boolean} true si tiene al menos una acción permitida
 */
export const canAccess = (role, resource) => {
  if (!role || !resource) return false;

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  return resourcePermissions && resourcePermissions.length > 0;
};

/**
 * Obtiene todos los permisos de un rol
 * @param {string} role - Rol del usuario
 * @returns {object} Objeto con todos los permisos del rol
 */
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || {};
};

/**
 * Obtiene todas las acciones permitidas para un rol sobre un recurso
 * @param {string} role - Rol del usuario
 * @param {string} resource - Recurso a consultar
 * @returns {array} Array de acciones permitidas
 */
export const getAllowedActions = (role, resource) => {
  if (!role || !resource) return [];

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return [];

  return rolePermissions[resource] || [];
};

/**
 * Obtiene todos los recursos accesibles por un rol
 * @param {string} role - Rol del usuario
 * @returns {array} Array de recursos permitidos
 */
export const getAccessibleResources = (role) => {
  if (!role) return [];

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return [];

  return Object.keys(rolePermissions);
};
