import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * Componente para proteger rutas que requieren autenticación y permisos
 * Si el usuario no está autenticado, redirige a login
 * Si no tiene permisos, redirige a una página de acceso denegado
 */
function ProtectedRoute({ children, resource = null, action = null }) {
  const { isAuthenticated, loading } = useAuth();
  const { can, canAccessResource } = usePermissions();

  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un recurso y acción, verificar permisos específicos
  if (resource && action) {
    if (!can(resource, action)) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  // Si solo se especifica un recurso, verificar acceso al recurso
  if (resource && !action) {
    if (!canAccessResource(resource)) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  // Usuario autenticado y con permisos, mostrar contenido
  return children;
}

export default ProtectedRoute;
