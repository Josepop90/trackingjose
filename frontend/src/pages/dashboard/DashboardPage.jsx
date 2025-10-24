import { useState, useEffect } from "react";
import {
  Users,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import StatsCard from "../../components/shared/StatsCard";
import api from "../../services/api";

/**
 * Dashboard Universal - Se adapta automáticamente según el rol del usuario
 * Reemplaza AdminDashboard, RecepcionDashboard y TecnicoDashboard
 */
function DashboardPage() {
  const { isAdmin, isRecepcionista, isTecnico, user } = usePermissions();
  const [stats, setStats] = useState({});
  const [reparacionesRecientes, setReparacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Llamar las funciones para obtener los valores booleanos
  const esAdmin = isAdmin();
  const esRecepcionista = isRecepcionista();
  const esTecnico = isTecnico();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar órdenes (ahora el token se agrega automáticamente por el interceptor)
      const ordenesRes = await api.get("/ordenes");
      const ordenes = ordenesRes.data;

      // Calcular estadísticas básicas (igual que AdminDashboard)
      const hoy = new Date().toDateString();
      const completadasHoy = ordenes.filter(
        (o) => o.cerrada_en && new Date(o.cerrada_en).toDateString() === hoy
      ).length;

      const activas = ordenes.filter((o) => !o.cerrada_en).length;
      const pendientes = ordenes.filter((o) => !o.tecnico_asignado).length;

      // Estadísticas según el rol (simplificado para que funcione)
      if (esTecnico) {
        console.log("✅ Entrando en rama TÉCNICO");
        // Técnico: filtrar solo las órdenes asignadas a este técnico
        const ordenesDelTecnico = ordenes.filter(
          (o) => o.tecnico_asignado === user?.id
        );
        console.log(`🔧 Órdenes del técnico ${user?.id}:`, ordenesDelTecnico.length);

        const activasDelTecnico = ordenesDelTecnico.filter((o) => !o.cerrada_en).length;
        const completadasDelTecnico = ordenesDelTecnico.filter((o) => o.cerrada_en).length;
        const completadasHoyDelTecnico = ordenesDelTecnico.filter(
          (o) => o.cerrada_en && new Date(o.cerrada_en).toDateString() === hoy
        ).length;

        setStats({
          ordenesAsignadas: ordenesDelTecnico.length,
          reparacionesActivas: activasDelTecnico,
          completadas: completadasDelTecnico,
          completadasHoy: completadasHoyDelTecnico,
          tiempoPromedio: "2.5 días",
          satisfaccion: "4.8/5",
        });

        setReparacionesRecientes(
          ordenesDelTecnico.slice(0, 5).map((orden) => ({
            id: orden.id,
            cliente: orden.cliente_nombre || `Cliente #${orden.cliente_id}`,
            dispositivo: `${orden.marca_nombre || 'Marca'} ${orden.modelo_nombre || 'Modelo'}`,
            progreso: Math.floor(Math.random() * 100),
            estado: orden.cerrada_en ? "Completado" : "En Reparación",
            codigo: `OR-${orden.id.toString().padStart(6, "0")}`,
          }))
        );
      } else if (esRecepcionista) {
        console.log("✅ Entrando en rama RECEPCIONISTA");
        // Recepcionista - Ver todas las órdenes del sistema
        const totalOrdenes = ordenes.length;
        const totalCompletadas = ordenes.filter((o) => o.cerrada_en).length;
        console.log(`📋 Total órdenes: ${totalOrdenes}, Completadas: ${totalCompletadas}`);

        setStats({
          ordenesHoy: ordenes.filter(
            (o) => new Date(o.creado_en).toDateString() === hoy
          ).length,
          pendientesAsignacion: pendientes,
          enProceso: activas,
          completadasHoy: completadasHoy,
          clientesAtendidos: new Set(ordenes.map((o) => o.cliente_id)).size,
          dispositivosIngresados: totalOrdenes,
          totalOrdenes: totalOrdenes,
          totalCompletadas: totalCompletadas,
        });

        setReparacionesRecientes(
          ordenes.slice(0, 5).map((orden) => ({
            id: orden.id,
            cliente: orden.cliente_nombre || `Cliente #${orden.cliente_id}`,
            dispositivo: `${orden.marca_nombre || 'Marca'} ${orden.modelo_nombre || 'Modelo'}`,
            tecnico: orden.tecnico_nombre || "Sin asignar",
            progreso: Math.floor(Math.random() * 100),
            estado: orden.cerrada_en ? "Completado" : "En Proceso",
            codigo: `OR-${orden.id.toString().padStart(6, "0")}`,
          }))
        );
      } else {
        console.log("✅ Entrando en rama ADMINISTRADOR");
        // Administrador: vista completa (IGUAL que AdminDashboard.jsx)
        const statsAdmin = {
          usuariosActivos: 12, // Temporal
          reparacionesActivas: activas,
          completadasHoy: completadasHoy,
          pendientesAsignacion: pendientes,
          tiempoPromedio: "2.5 días",
          satisfaccionCliente: "4.8/5",
        };
        console.log("👑 Stats Admin:", statsAdmin);
        setStats(statsAdmin);

        setReparacionesRecientes(
          ordenes.slice(0, 3).map((orden) => ({
            id: orden.id,
            cliente: orden.cliente_nombre || `Cliente #${orden.cliente_id}`,
            dispositivo: `${orden.marca_nombre || 'Marca'} ${orden.modelo_nombre || 'Modelo'}`,
            tecnico: orden.tecnico_nombre || "Sin asignar",
            progreso: Math.floor(Math.random() * 100),
            estado: orden.cerrada_en ? "Completado" : "En Reparación",
            codigo: `OR-${orden.id.toString().padStart(6, "0")}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Configuración de tarjetas según el rol
  const getStatsCards = () => {
    if (esTecnico) {
      return [
        {
          title: "Órdenes Asignadas",
          value: stats.ordenesAsignadas || 0,
          subtitle: "Total de reparaciones asignadas",
          icon: ClipboardList,
          color: "blue",
        },
        {
          title: "En Proceso",
          value: stats.reparacionesActivas || 0,
          subtitle: "Reparaciones activas",
          icon: Wrench,
          color: "cyan",
        },
        {
          title: "Completadas",
          value: stats.completadas || 0,
          subtitle: "Reparaciones finalizadas",
          icon: CheckCircle,
          color: "green",
        },
        {
          title: "Completadas Hoy",
          value: stats.completadasHoy || 0,
          subtitle: "Finalizadas hoy",
          icon: TrendingUp,
          color: "purple",
        },
      ];
    }

    if (esRecepcionista) {
      return [
        {
          title: "Total Órdenes",
          value: stats.totalOrdenes || 0,
          subtitle: "Todas las órdenes registradas",
          icon: ClipboardList,
          color: "blue",
        },
        {
          title: "En Proceso",
          value: stats.enProceso || 0,
          subtitle: "Órdenes activas",
          icon: Clock,
          color: "cyan",
        },
        {
          title: "Completadas",
          value: stats.totalCompletadas || 0,
          subtitle: "Órdenes finalizadas",
          icon: CheckCircle,
          color: "green",
        },
        {
          title: "Completadas Hoy",
          value: stats.completadasHoy || 0,
          subtitle: "Finalizadas hoy",
          icon: TrendingUp,
          color: "purple",
        },
        {
          title: "Pendientes Asignación",
          value: stats.pendientesAsignacion || 0,
          subtitle: "Requieren técnico",
          icon: AlertTriangle,
          color: "amber",
        },
        {
          title: "Clientes Atendidos",
          value: stats.clientesAtendidos || 0,
          subtitle: "Total de clientes",
          icon: UserCheck,
          color: "pink",
        },
      ];
    }

    // Administrador - vista completa
    return [
      {
        title: "Usuarios Activos",
        value: stats.usuariosActivos || 0,
        subtitle: "Personal registrado en el sistema",
        icon: Users,
        color: "blue",
      },
      {
        title: "Reparaciones Activas",
        value: stats.reparacionesActivas || 0,
        subtitle: "Dispositivos en proceso",
        icon: Wrench,
        color: "cyan",
      },
      {
        title: "Completadas Hoy",
        value: stats.completadasHoy || 0,
        subtitle: "Reparaciones finalizadas",
        icon: CheckCircle,
        color: "green",
      },
      {
        title: "Pendientes Asignación",
        value: stats.pendientesAsignacion || 0,
        subtitle: "Requieren técnico asignado",
        icon: AlertTriangle,
        color: "amber",
      },
      {
        title: "Tiempo Promedio",
        value: stats.tiempoPromedio || "0 días",
        subtitle: "Duración de reparaciones",
        icon: Clock,
        color: "purple",
      },
      {
        title: "Satisfacción Cliente",
        value: stats.satisfaccionCliente || "0/5",
        subtitle: "Calificación promedio",
        icon: TrendingUp,
        color: "pink",
      },
    ];
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

  const statsCards = getStatsCards();

  return (
    <div className="space-y-6">
      {/* Header con info del usuario */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenido, {user?.nombre || "Usuario"}
        </h1>
        <p className="text-cyan-100">
          {esAdmin && "Panel de administración completa del sistema"}
          {esRecepcionista && "Gestión de clientes y órdenes de reparación"}
          {esTecnico && "Gestión de reparaciones asignadas"}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Reparaciones/Órdenes Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {esTecnico
              ? "Mis Reparaciones"
              : esRecepcionista
              ? "Órdenes Recientes"
              : "Reparaciones Recientes"}
          </h3>
          <p className="text-sm text-gray-500">
            {esTecnico
              ? "Reparaciones asignadas a ti"
              : esRecepcionista
              ? "Últimas órdenes creadas"
              : "Estado actual de las reparaciones en proceso"}
          </p>
        </div>

        <div className="space-y-4">
          {reparacionesRecientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay {esTecnico ? "reparaciones asignadas" : "órdenes recientes"}
            </div>
          ) : (
            reparacionesRecientes.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.cliente}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.dispositivo}
                    </p>
                    {item.tecnico && (
                      <p className="text-xs text-gray-500">
                        Técnico: {item.tecnico}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.estado === "Completado"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.estado}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-semibold text-gray-900">
                      {item.progreso}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.progreso}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Código: {item.codigo}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
