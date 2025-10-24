import { useState, useEffect } from "react";
import { Wrench, Search, Eye, CheckCircle, Clock, AlertCircle, User, Smartphone, Flag, ClipboardList, History } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function ReparacionesPage() {
  const { can, RESOURCES, ACTIONS, isTecnico } = usePermissions();
  const { user } = useAuth();
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [ordenes, setOrdenes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showCambioEstadoModal, setShowCambioEstadoModal] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [formCambioEstado, setFormCambioEstado] = useState({
    estado_destino: "",
    nota: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ordenesRes, estadosRes] = await Promise.all([
        api.get("/ordenes"),
        api.get("/estados"),
      ]);

      let ordenesData = ordenesRes.data;

      // Si es técnico, filtrar solo sus órdenes asignadas
      if (isTecnico()) {
        ordenesData = ordenesData.filter(
          (orden) => orden.tecnico_asignado === user.id
        );
      }

      setOrdenes(ordenesData);
      setEstados(estadosRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async (ordenId) => {
    try {
      const response = await api.get(`/historial/orden/${ordenId}`);
      setHistorial(response.data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
    }
  };

  const abrirDetalleOrden = async (orden) => {
    setOrdenSeleccionada(orden);
    await cargarHistorial(orden.id);
    setShowDetalleModal(true);
  };

  const abrirCambioEstado = (orden) => {
    setOrdenSeleccionada(orden);
    setFormCambioEstado({
      estado_destino: orden.estado_actual_id,
      nota: "",
    });
    setShowCambioEstadoModal(true);
  };

  const handleCambioEstado = async (e) => {
    e.preventDefault();

    try {
      // Actualizar el estado de la orden
      await api.patch(`/ordenes/${ordenSeleccionada.id}`, {
        estado_actual_id: formCambioEstado.estado_destino,
      });

      // Si hay una nota, registrarla en el historial
      if (formCambioEstado.nota.trim()) {
        await api.post("/historial", {
          orden_id: ordenSeleccionada.id,
          estado_origen: ordenSeleccionada.estado_actual_id,
          estado_destino: formCambioEstado.estado_destino,
          nota: formCambioEstado.nota,
          cambiado_por: user.id,
        });
      }

      toast.success("Estado actualizado exitosamente");
      cargarDatos();
      setShowCambioEstadoModal(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error(error.response?.data?.error || "Error al cambiar estado");
    }
  };

  const ordenesFiltradas = ordenes.filter((orden) => {
    const cliente = orden.cliente_nombre || "";
    const dispositivo = `${orden.marca_nombre || ""} ${orden.modelo_nombre || ""}`;
    const cumpleBusqueda =
      cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispositivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orden.dispositivo_imei && orden.dispositivo_imei.includes(searchTerm));

    if (filtroEstado === "todas") return cumpleBusqueda;
    if (filtroEstado === "pendientes") {
      const estado = (orden.estado_nombre || "").toLowerCase();
      return cumpleBusqueda && (estado.includes("recibido") || estado.includes("pendiente"));
    }
    if (filtroEstado === "proceso") {
      const estado = (orden.estado_nombre || "").toLowerCase();
      return cumpleBusqueda && (estado.includes("proceso") || estado.includes("reparación"));
    }
    if (filtroEstado === "completadas") {
      const estado = (orden.estado_nombre || "").toLowerCase();
      return cumpleBusqueda && (estado.includes("completado") || estado.includes("entregado"));
    }
    return cumpleBusqueda;
  });

  const getEstadoColor = (estadoNombre) => {
    if (!estadoNombre) return "bg-gray-100 text-gray-700";
    const lower = estadoNombre.toLowerCase();
    if (lower.includes("recibido") || lower.includes("pendiente"))
      return "bg-yellow-100 text-yellow-700";
    if (lower.includes("proceso") || lower.includes("reparación"))
      return "bg-blue-100 text-blue-700";
    if (lower.includes("completado") || lower.includes("entregado"))
      return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-700";
      case "normal":
        return "bg-blue-100 text-blue-700";
      case "baja":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return <AlertCircle className="w-4 h-4" />;
      case "normal":
        return <Clock className="w-4 h-4" />;
      case "baja":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reparaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reparaciones</h1>
            <p className="text-purple-100">
              {isTecnico()
                ? "Gestiona tus órdenes asignadas"
                : "Monitorea el progreso de las reparaciones"}
            </p>
          </div>
          <Wrench className="w-12 h-12" />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{ordenes.length}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <Wrench className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  ordenes.filter((o) => {
                    const estado = (o.estado_nombre || "").toLowerCase();
                    return estado.includes("pendiente") || estado.includes("recibido");
                  }).length
                }
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  ordenes.filter((o) => {
                    const estado = (o.estado_nombre || "").toLowerCase();
                    return estado.includes("proceso") || estado.includes("reparación");
                  }).length
                }
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  ordenes.filter((o) => {
                    const estado = (o.estado_nombre || "").toLowerCase();
                    return estado.includes("completado") || estado.includes("entregado");
                  }).length
                }
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, dispositivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroEstado("todas")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroEstado === "todas"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroEstado("pendientes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroEstado === "pendientes"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado("proceso")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroEstado === "proceso"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setFiltroEstado("completadas")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroEstado === "completadas"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completadas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {ordenesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No se encontraron órdenes"
                : "No hay órdenes para mostrar"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Técnico
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordenesFiltradas.map((orden) => (
                  <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{orden.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {orden.cliente_nombre}
                        </div>
                        <div className="text-xs text-gray-500">
                          {orden.cliente_telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {orden.marca_nombre} {orden.modelo_nombre}
                        </div>
                        {orden.dispositivo_imei && (
                          <div className="text-xs text-gray-500">
                            IMEI: {orden.dispositivo_imei}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                          orden.estado_nombre
                        )}`}
                      >
                        {orden.estado_nombre || "Sin estado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getPrioridadColor(
                          orden.prioridad
                        )}`}
                      >
                        {getPrioridadIcon(orden.prioridad)}
                        {orden.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {orden.tecnico_nombre || (
                          <span className="text-gray-400">Sin asignar</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirDetalleOrden(orden)}
                          className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver Detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {can(RESOURCES.REPARACIONES, ACTIONS.EDIT) && (
                          <button
                            onClick={() => abrirCambioEstado(orden)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Cambiar Estado"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <Modal
        isOpen={showDetalleModal}
        onClose={() => setShowDetalleModal(false)}
        title={`Detalle de Orden #${ordenSeleccionada?.id}`}
        size="lg"
      >
        {ordenSeleccionada && (
          <div className="space-y-6">
            {/* Cliente */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Cliente</h3>
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 font-medium">{ordenSeleccionada.cliente_nombre}</p>
                <p className="text-gray-600 text-sm">📞 {ordenSeleccionada.cliente_telefono}</p>
              </div>
            </div>

            {/* Dispositivo */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Dispositivo</h3>
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 font-medium">
                  {ordenSeleccionada.marca_nombre} {ordenSeleccionada.modelo_nombre}
                </p>
                {ordenSeleccionada.dispositivo_imei && (
                  <p className="text-gray-600 text-sm">📱 IMEI: {ordenSeleccionada.dispositivo_imei}</p>
                )}
              </div>
            </div>

            {/* Problema Reportado */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Descripción del Problema</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{ordenSeleccionada.descripcion_problema}</p>
            </div>

            {/* Estado y Prioridad */}
            <div className="grid grid-cols-2 gap-4">
              {/* Estado */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Estado</h3>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(
                    ordenSeleccionada.estado_nombre
                  )}`}
                >
                  {ordenSeleccionada.estado_nombre || "Sin estado"}
                </span>
              </div>

              {/* Prioridad */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Prioridad</h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${getPrioridadColor(
                    ordenSeleccionada.prioridad
                  )}`}
                >
                  {getPrioridadIcon(ordenSeleccionada.prioridad)}
                  {ordenSeleccionada.prioridad?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Historial de Cambios */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-indigo-500 p-2 rounded-lg">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Historial de Cambios</h3>
              </div>
              <div className="bg-white rounded-lg p-3 max-h-60 overflow-y-auto">
                {historial.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No hay historial disponible</p>
                ) : (
                  <div className="space-y-3">
                    {historial.map((h, index) => (
                      <div 
                        key={h.id} 
                        className={`border-l-4 border-indigo-400 pl-4 py-2 ${
                          index !== historial.length - 1 ? 'border-b border-gray-200 pb-3' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {h.estado_origen_nombre || "Inicio"}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {h.estado_destino_nombre}
                          </span>
                        </div>
                        {h.nota && (
                          <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 mt-2">
                            💬 {h.nota}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          🕐 {new Date(h.creado_en).toLocaleString("es-GT", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {h.tecnico && ` • 👤 ${h.tecnico}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Cambio de Estado */}
      <Modal
        isOpen={showCambioEstadoModal}
        onClose={() => setShowCambioEstadoModal(false)}
        title="Cambiar Estado de Reparación"
        size="md"
      >
        <form onSubmit={handleCambioEstado} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado *
            </label>
            <select
              required
              value={formCambioEstado.estado_destino}
              onChange={(e) =>
                setFormCambioEstado({
                  ...formCambioEstado,
                  estado_destino: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona un estado</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.etiqueta_publica}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota (opcional)
            </label>
            <textarea
              value={formCambioEstado.nota}
              onChange={(e) =>
                setFormCambioEstado({ ...formCambioEstado, nota: e.target.value })
              }
              rows={3}
              placeholder="Agrega una nota sobre este cambio..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowCambioEstadoModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-medium transition-all shadow-lg shadow-purple-500/30"
            >
              Actualizar Estado
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
      />
    </div>
  );
}

export default ReparacionesPage;