import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import api from "../../services/api";

function ReportesPage() {
  const [stats, setStats] = useState({
    totalOrdenes: 0,
    ordenesActivas: 0,
    ordenesCompletadas: 0,
    ordenesPendientes: 0,
    usuariosActivos: 0,
    tecnicosActivos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const [tecnicosStats, setTecnicosStats] = useState([]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ordenesRes, usuariosRes] = await Promise.all([
        api.get("/ordenes"),
        api.get("/usuarios"),
      ]);

      const ordenes = ordenesRes.data;
      const usuarios = usuariosRes.data;

      // Calcular estadísticas
      const activas = ordenes.filter((o) => {
        const estado = (o.estado_nombre || "").toLowerCase();
        return !estado.includes("completado") && !estado.includes("entregado");
      }).length;

      const completadas = ordenes.filter((o) => {
        const estado = (o.estado_nombre || "").toLowerCase();
        return estado.includes("completado") || estado.includes("entregado");
      }).length;

      const pendientes = ordenes.filter((o) => {
        const estado = (o.estado_nombre || "").toLowerCase();
        return estado.includes("pendiente") || estado.includes("recibido");
      }).length;

      const usuariosActivos = usuarios.filter((u) => u.activo).length;
      const tecnicosActivos = usuarios.filter(
        (u) => u.rol_nombre === "Técnico" && u.activo
      ).length;

      // Calcular estadísticas por técnico
      const tecnicosConOrdenes = {};
      ordenes.forEach((orden) => {
        if (orden.tecnico_asignado && orden.tecnico_nombre) {
          if (!tecnicosConOrdenes[orden.tecnico_nombre]) {
            tecnicosConOrdenes[orden.tecnico_nombre] = {
              total: 0,
              completadas: 0,
            };
          }
          tecnicosConOrdenes[orden.tecnico_nombre].total++;
          const estado = (orden.estado_nombre || "").toLowerCase();
          if (estado.includes("completado") || estado.includes("entregado")) {
            tecnicosConOrdenes[orden.tecnico_nombre].completadas++;
          }
        }
      });

      const statsArray = Object.entries(tecnicosConOrdenes).map(([nombre, stats]) => ({
        nombre,
        total: stats.total,
        completadas: stats.completadas,
        porcentaje: stats.total > 0 ? Math.round((stats.completadas / stats.total) * 100) : 0,
      }));

      setTecnicosStats(statsArray);

      setStats({
        totalOrdenes: ordenes.length,
        ordenesActivas: activas,
        ordenesCompletadas: completadas,
        ordenesPendientes: pendientes,
        usuariosActivos: usuariosActivos,
        tecnicosActivos: tecnicosActivos,
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Órdenes",
      value: stats.totalOrdenes,
      subtitle: "Órdenes en el sistema",
      icon: BarChart3,
      color: "blue",
    },
    {
      title: "Órdenes Activas",
      value: stats.ordenesActivas,
      subtitle: "En proceso de reparación",
      icon: Wrench,
      color: "cyan",
    },
    {
      title: "Completadas",
      value: stats.ordenesCompletadas,
      subtitle: "Reparaciones finalizadas",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pendientes",
      value: stats.ordenesPendientes,
      subtitle: "Esperando asignación",
      icon: AlertTriangle,
      color: "amber",
    },
    {
      title: "Usuarios Activos",
      value: stats.usuariosActivos,
      subtitle: "Personal registrado",
      icon: Users,
      color: "purple",
    },
    {
      title: "Técnicos Activos",
      value: stats.tecnicosActivos,
      subtitle: "Técnicos disponibles",
      icon: TrendingUp,
      color: "pink",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      cyan: "bg-cyan-50 text-cyan-600",
      green: "bg-green-50 text-green-600",
      amber: "bg-amber-50 text-amber-600",
      purple: "bg-purple-50 text-purple-600",
      pink: "bg-pink-50 text-pink-600",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reportes y Estadísticas</h1>
            <p className="text-emerald-100">
              Resumen general del sistema de reparaciones
            </p>
          </div>
          <BarChart3 className="w-12 h-12" />
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

      {/* Información adicional */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Resumen del Sistema</h3>
          <p className="text-sm text-gray-500">
            Estadísticas generales del sistema de reparaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">Estado de Órdenes</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-green-700">Completadas</span>
                <span className="font-bold text-green-600">{stats.ordenesCompletadas}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <span className="text-sm text-cyan-700">En Proceso</span>
                <span className="font-bold text-cyan-600">{stats.ordenesActivas}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm text-amber-700">Pendientes</span>
                <span className="font-bold text-amber-600">{stats.ordenesPendientes}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">Personal del Sistema</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-purple-700">Total Usuarios</span>
                <span className="font-bold text-purple-600">{stats.usuariosActivos}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                <span className="text-sm text-pink-700">Técnicos Activos</span>
                <span className="font-bold text-pink-600">{stats.tecnicosActivos}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-blue-700">Total Órdenes</span>
                <span className="font-bold text-blue-600">{stats.totalOrdenes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rendimiento de Técnicos */}
      {tecnicosStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Rendimiento de Técnicos
            </h3>
            <p className="text-sm text-gray-500">
              Estado actual de las órdenes por técnico
            </p>
          </div>

          <div className="space-y-4">
            {tecnicosStats.map((tecnico, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {tecnico.nombre}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {tecnico.completadas} de {tecnico.total} órdenes completadas
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {tecnico.porcentaje}%
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-semibold text-gray-900">
                      {tecnico.completadas}/{tecnico.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${tecnico.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportesPage;
