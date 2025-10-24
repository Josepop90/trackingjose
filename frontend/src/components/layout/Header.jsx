import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Construir nombre completo
  const getNombreCompleto = () => {
    if (!user) return "Usuario";
    
    // Si tiene nombre_completo directo
    if (user.nombre_completo) return user.nombre_completo;
    
    // Si tiene nombre y apellido separados
    if (user.nombre && user.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    
    // Si solo tiene nombre
    if (user.nombre) return user.nombre;
    
    return "Usuario";
  };

  // Obtener rol
  const getRol = () => {
    if (!user) return "Sin rol";
    return user.rol_nombre || user.rol || "Sin rol";
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Información del usuario y rol */}
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              Bienvenido, {getNombreCompleto()}
            </p>
            <p className="text-xs text-gray-500">
              {getRol()}
            </p>
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil */}
          <button className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;