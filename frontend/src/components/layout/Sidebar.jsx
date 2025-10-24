import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Wrench, 
  FileText, 
  Settings,
  Smartphone
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      title: "Resumen",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Usuarios",
      path: "/admin/usuarios",
      icon: UserCog,
    },
    {
      title: "Clientes",
      path: "/admin/clientes",
      icon: Users,
    },
    {
      title: "Dispositivos",
      path: "/admin/dispositivos",
      icon: Smartphone,
    },
    {
      title: "Reparaciones",
      path: "/admin/reparaciones",
      icon: Wrench,
    },
    {
      title: "Historial",
      path: "/admin/historial",
      icon: FileText,
    },
    {
      title: "Configuración",
      path: "/admin/configuracion",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Panel de Administración</h2>
            <p className="text-xs text-cyan-600">Tecnología Virtual Cel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Virtual Cel
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;