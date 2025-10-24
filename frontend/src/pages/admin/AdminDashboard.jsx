import { useState, useEffect } from "react";
import { 
  Users, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp 
} from "lucide-react";
import api from "../../services/api";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [stats, setStats] = useState({
    usuariosActivos: 0,
    reparacionesActivas: 0,
    completadasHoy: 0,
    pendientesAsignacion: 0,
    tiempoPromedio: "0 días",
    satisfaccionCliente: "0/5"
  });
  const [reparacionesRecientes, setReparacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener token del localStorage
      const token = localStorage.getItem("token");
      
      // Configurar headers con token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Cargar órdenes
      const ordenesRes = await api.get("/ordenes", config);
      const ordenes = ordenesRes.data;

      // Calcular estadísticas básicas
      const hoy = new Date().toDateString();
      const completadasHoy = ordenes.filter(o => 
        o.cerrada_en && new Date(o.cerrada_en).toDateString() === hoy
      ).length;

      const activas = ordenes.filter(o => !o.cerrada_en).length;
      const pendientes = ordenes.filter(o => !o.tecnico_asignado).length;

      setStats({
        usuariosActivos: 12, // Temporal
        reparacionesActivas: activas,
        completadasHoy: completadasHoy,
        pendientesAsignacion: pendientes,
        tiempoPromedio: "2.5 días",
        satisfaccionCliente: "4.8/5"
      });

      // Obtener las últimas 3 órdenes para mostrar
      const ultimasOrdenes = ordenes.slice(0, 3).map(orden => ({
        id: orden.id,
        cliente: `Cliente #${orden.cliente_id}`,
        dispositivo: `Dispositivo #${orden.dispositivo_id}`,
        tecnico: orden.tecnico_asignado ? `Técnico #${orden.tecnico_asignado}` : "Sin asignar",
        progreso: Math.floor(Math.random() * 100), // Temporal
        estado: orden.cerrada_en ? "Completado" : "En Reparación",
        codigo: `OR-${orden.id.toString().padStart(6, '0')}`
      }));

      setReparacionesRecientes(ultimasOrdenes);

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "resumen", label: "Resumen" },
    { id: "usuarios", label: "Usuarios" },
    { id: "reparaciones", label: "Reparaciones" },
    { id: "configuracion", label: "Configuración" }
  ];

  const statsCards = [
    {
      title: "Usuarios Activos",
      value: stats.usuariosActivos,
      subtitle: "Personal registrado en el sistema",
      icon: Users,
      color: "blue"
    },
    {
      title: "Reparaciones Activas",
      value: stats.reparacionesActivas,
      subtitle: "Dispositivos en proceso",
      icon: Wrench,
      color: "cyan"
    },
    {
      title: "Completadas Hoy",
      value: stats.completadasHoy,
      subtitle: "Reparaciones finalizadas",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Pendientes Asignación",
      value: stats.pendientesAsignacion,
      subtitle: "Requieren técnico asignado",
      icon: AlertTriangle,
      color: "amber"
    },
    {
      title: "Tiempo Promedio",
      value: stats.tiempoPromedio,
      subtitle: "Duración de reparaciones",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Satisfacción Cliente",
      value: stats.satisfaccionCliente,
      subtitle: "Calificación promedio",
      icon: TrendingUp,
      color: "pink"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      cyan: "bg-cyan-50 text-cyan-600",
      green: "bg-green-50 text-green-600",
      amber: "bg-amber-50 text-amber-600",
      purple: "bg-purple-50 text-purple-600",
      pink: "bg-pink-50 text-pink-600"
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reparaciones Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Reparaciones Recientes
          </h3>
          <p className="text-sm text-gray-500">
            Estado actual de las reparaciones en proceso
          </p>
        </div>

        <div className="space-y-4">
          {reparacionesRecientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay reparaciones recientes
            </div>
          ) : (
            reparacionesRecientes.map((reparacion) => (
              <div
                key={reparacion.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {reparacion.cliente}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {reparacion.dispositivo}
                    </p>
                    <p className="text-xs text-gray-500">
                      Técnico: {reparacion.tecnico}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reparacion.estado === "Completado"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {reparacion.estado}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-semibold text-gray-900">
                      {reparacion.progreso}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${reparacion.progreso}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Código QR: {reparacion.codigo}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;