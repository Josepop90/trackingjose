import { useAuth } from "../contexts/AuthContext";
import {
  hasPermission,
  canAccess,
  getAllowedActions,
  getAccessibleResources,
  RESOURCES,
  ACTIONS,
} from "../utils/permissions";

/**
 * Hook personalizado para manejar permisos del usuario
 * Proporciona funciones para verificar permisos basados en el rol del usuario
 */
export const usePermissions = () => {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

  /**
   * Verifica si el usuario tiene permiso para una acción específica
   * @param {string} resource - Recurso a verificar
   * @param {string} action - Acción a verificar
   * @returns {boolean}
   */
  const can = (resource, action) => {
    if (!userRole) return false;
    return hasPermission(userRole, resource, action);
  };

  /**
   * Verifica si el usuario puede acceder a un recurso
   * @param {string} resource - Recurso a verificar
   * @returns {boolean}
   */
  const canAccessResource = (resource) => {
    if (!userRole) return false;
    return canAccess(userRole, resource);
  };

  /**
   * Obtiene todas las acciones permitidas para un recurso
   * @param {string} resource - Recurso a consultar
   * @returns {array}
   */
  const getActions = (resource) => {
    if (!userRole) return [];
    return getAllowedActions(userRole, resource);
  };

  /**
   * Obtiene todos los recursos accesibles por el usuario
   * @returns {array}
   */
  const getResources = () => {
    if (!userRole) return [];
    return getAccessibleResources(userRole);
  };

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean}
   */
  const isAdmin = () => {
    return userRole === "Administrador";
  };

  /**
   * Verifica si el usuario es recepcionista
   * @returns {boolean}
   */
  const isRecepcionista = () => {
    return userRole === "Recepcionista";
  };

  /**
   * Verifica si el usuario es técnico
   * @returns {boolean}
   */
  const isTecnico = () => {
    return userRole === "Técnico";
  };

  /**
   * Verifica permisos múltiples (todas las acciones deben estar permitidas)
   * @param {array} permissions - Array de objetos {resource, action}
   * @returns {boolean}
   */
  const canAll = (permissions) => {
    if (!userRole || !Array.isArray(permissions)) return false;
    return permissions.every((perm) =>
      hasPermission(userRole, perm.resource, perm.action)
    );
  };

  /**
   * Verifica permisos múltiples (al menos una acción debe estar permitida)
   * @param {array} permissions - Array de objetos {resource, action}
   * @returns {boolean}
   */
  const canAny = (permissions) => {
    if (!userRole || !Array.isArray(permissions)) return false;
    return permissions.some((perm) =>
      hasPermission(userRole, perm.resource, perm.action)
    );
  };

  return {
    // Usuario y rol
    user,
    userRole,

    // Verificación de permisos
    can,
    canAccessResource,
    canAll,
    canAny,

    // Obtener permisos
    getActions,
    getResources,

    // Verificación de roles
    isAdmin,
    isRecepcionista,
    isTecnico,

    // Constantes para usar en componentes
    RESOURCES,
    ACTIONS,
  };
};

export default usePermissions;
