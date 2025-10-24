import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Wrench,
  FileText,
  Settings,
  Smartphone,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * Sidebar dinámico que se adapta según el rol del usuario
 * Muestra solo las opciones a las que el usuario tiene acceso
 */
function DynamicSidebar() {
  const { canAccessResource, RESOURCES, userRole } = usePermissions();

  // Definición completa de todas las opciones de menú
  const allMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      resource: RESOURCES.DASHBOARD,
    },
    {
      title: "Usuarios",
      path: "/dashboard/usuarios",
      icon: UserCog,
      resource: RESOURCES.USUARIOS,
    },
    {
      title: "Clientes",
      path: "/dashboard/clientes",
      icon: Users,
      resource: RESOURCES.CLIENTES,
    },
    {
      title: "Dispositivos",
      path: "/dashboard/dispositivos",
      icon: Smartphone,
      resource: RESOURCES.DISPOSITIVOS,
    },
    {
      title: "Órdenes",
      path: "/dashboard/ordenes",
      icon: ClipboardList,
      resource: RESOURCES.ORDENES,
    },
    {
      title: "Reparaciones",
      path: "/dashboard/reparaciones",
      icon: Wrench,
      resource: RESOURCES.REPARACIONES,
    },
    {
      title: "Historial",
      path: "/dashboard/historial",
      icon: FileText,
      resource: RESOURCES.HISTORIAL,
    },
    {
      title: "Reportes",
      path: "/dashboard/reportes",
      icon: BarChart3,
      resource: RESOURCES.REPORTES,
    },
    {
      title: "Marcas y Modelos",
      path: "/dashboard/configuracion",
      icon: Settings,
      resource: RESOURCES.CONFIGURACION,
    },
  ];

  // Filtrar menú según permisos del usuario
  const menuItems = allMenuItems.filter((item) =>
    canAccessResource(item.resource)
  );

  // Textos según el rol
  const getTitleByRole = () => {
    switch (userRole) {
      case "Administrador":
        return "Panel de Administración";
      case "Recepcionista":
        return "Panel de Recepción";
      case "Técnico":
        return "Panel Técnico";
      default:
        return "Virtual Cel";
    }
  };

  const getSubtitleByRole = () => {
    switch (userRole) {
      case "Administrador":
        return "Gestión completa del sistema";
      case "Recepcionista":
        return "Atención al cliente";
      case "Técnico":
        return "Gestión de reparaciones";
      default:
        return "Tecnología Virtual Cel";
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              {getTitleByRole()}
            </h2>
            <p className="text-xs text-cyan-600">{getSubtitleByRole()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Dinámico según permisos */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.length === 0 ? (
          <div className="text-center text-sm text-gray-500 p-4">
            No hay opciones disponibles
          </div>
        ) : (
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-blue-700 font-medium shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Footer con info del rol */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 mb-2">
          <p className="text-xs font-semibold text-blue-700 mb-1">
            Rol Activo
          </p>
          <p className="text-sm font-bold text-blue-900">{userRole}</p>
        </div>
        <div className="text-xs text-gray-500 text-center">
          © 2025 Virtual Cel
        </div>
      </div>
    </aside>
  );
}

export default DynamicSidebar;
