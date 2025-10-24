import { useState, useEffect, useRef } from "react";
import { ClipboardList, Plus, Edit, Trash2, Search, Eye, Printer, User, Smartphone, AlertCircle, Calendar, Wrench, Flag } from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import { usePermissions } from "../../hooks/usePermissions";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import TicketOrden from "../../components/shared/TicketOrden";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function OrdenesPage() {
  const { can, RESOURCES, ACTIONS, isAdmin } = usePermissions();
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOrden, setEditingOrden] = useState(null);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [ordenDetalles, setOrdenDetalles] = useState(null);
  const ticketRef = useRef();
  const [formData, setFormData] = useState({
    cliente_id: "",
    dispositivo_id: "",
    descripcion_problema: "",
    tecnico_asignado: "",
    estado_actual_id: "",
    prioridad: "normal",
    fecha_entrega_estimada: "",
  });

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `Orden-${ordenDetalles?.id}`,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ordenesRes, clientesRes, dispositivosRes, estadosRes, usuariosRes] =
        await Promise.all([
          api.get("/ordenes"),
          api.get("/clientes"),
          api.get("/dispositivos"),
          api.get("/estados"),
          api.get("/usuarios"),
        ]);
      setOrdenes(ordenesRes.data);
      setClientes(clientesRes.data);
      setDispositivos(dispositivosRes.data);
      setEstados(estadosRes.data);
      setUsuarios(usuariosRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar dispositivos del cliente seleccionado
  const dispositivosFiltrados = formData.cliente_id
    ? dispositivos.filter(d => d.cliente_id === formData.cliente_id)
    : [];

  // Seleccionar automáticamente el dispositivo si el cliente solo tiene uno
  useEffect(() => {
    if (dispositivosFiltrados.length === 1 && !formData.dispositivo_id) {
      setFormData(prev => ({
        ...prev,
        dispositivo_id: dispositivosFiltrados[0].id
      }));
    }
  }, [dispositivosFiltrados, formData.dispositivo_id]);

  const handleVerDetalles = async (orden) => {
    try {
      const response = await api.get(`/ordenes/${orden.id}/detalle`);
      setOrdenDetalles(response.data);
      setShowDetallesModal(true);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      toast.error('Error al cargar los detalles de la orden');
    }
  };

  const handlePrintTicket = async (orden) => {
    try {
      const response = await api.get(`/ordenes/${orden.id}/detalle`);
      setOrdenDetalles(response.data);
      setTimeout(() => {
        if (handlePrint) {
          handlePrint();
        }
      }, 300);
    } catch (error) {
      console.error('Error al cargar orden para imprimir:', error);
      toast.error('Error al preparar el ticket para imprimir');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        cliente_id: formData.cliente_id,
        dispositivo_id: formData.dispositivo_id,
        descripcion_problema: formData.descripcion_problema,
        tecnico_asignado: formData.tecnico_asignado || null,
        estado_actual_id: formData.estado_actual_id || 1,
        prioridad: formData.prioridad,
        fecha_entrega_estimada: formData.fecha_entrega_estimada || null,
      };

      if (editingOrden) {
        await api.patch(`/ordenes/${editingOrden.id}`, dataToSend);
        toast.success("Orden actualizada exitosamente");
      } else {
        await api.post("/ordenes", dataToSend);
        toast.success("Orden creada exitosamente");
      }

      cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar orden:", error);
      toast.error(error.response?.data?.error || "Error al guardar orden");
    }
  };

  const handleEliminar = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Orden",
      message: "¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });

    if (!confirmed) return;

    try {
      await api.delete(`/ordenes/${id}`);
      toast.success("Orden eliminada exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar orden:", error);
      toast.error(error.response?.data?.error || "Error al eliminar orden");
    }
  };

  const abrirModalNuevo = () => {
    setEditingOrden(null);
    setFormData({
      cliente_id: "",
      dispositivo_id: "",
      descripcion_problema: "",
      tecnico_asignado: "",
      estado_actual_id: "",
      prioridad: "normal",
      fecha_entrega_estimada: "",
    });
    setShowModal(true);
  };

  const abrirModalEditar = (orden) => {
    setEditingOrden(orden);
    setFormData({
      cliente_id: orden.cliente_id,
      dispositivo_id: orden.dispositivo_id,
      descripcion_problema: orden.descripcion_problema,
      tecnico_asignado: orden.tecnico_asignado || "",
      estado_actual_id: orden.estado_actual_id,
      prioridad: orden.prioridad,
      fecha_entrega_estimada: orden.fecha_entrega_estimada
        ? orden.fecha_entrega_estimada.split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingOrden(null);
  };

  const ordenesFiltradas = ordenes.filter((orden) => {
    const cliente = orden.cliente_nombre || "";
    const dispositivo = `${orden.marca_nombre || ""} ${orden.modelo_nombre || ""}`;
    const estado = orden.estado_nombre || "";
    return (
      cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispositivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orden.dispositivo_imei && orden.dispositivo_imei.includes(searchTerm))
    );
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestión de Órdenes</h1>
            <p className="text-orange-100">
              Administra todas las órdenes de reparación
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <ClipboardList className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y nuevo */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, dispositivo, estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          {can(RESOURCES.ORDENES, ACTIONS.CREATE) && (
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nueva Orden
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problema
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No se encontraron órdenes
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((orden) => (
                  <tr
                    key={orden.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {orden.cliente_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {orden.cliente_telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {orden.marca_nombre || "N/A"} {orden.modelo_nombre || ""}
                        </div>
                        {orden.dispositivo_imei && (
                          <div className="text-sm text-gray-500">
                            IMEI: {orden.dispositivo_imei}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-gray-700">
                        {orden.descripcion_problema}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                          orden.estado_nombre
                        )}`}
                      >
                        {orden.estado_nombre || "Sin estado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(
                          orden.prioridad
                        )}`}
                      >
                        {orden.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {orden.tecnico_nombre || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {can(RESOURCES.ORDENES, ACTIONS.VIEW) && (
                          <button
                            onClick={() => handlePrintTicket(orden)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Imprimir Ticket"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        {can(RESOURCES.ORDENES, ACTIONS.VIEW) && (
                          <button
                            onClick={() => handleVerDetalles(orden)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Ver Detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {can(RESOURCES.ORDENES, ACTIONS.EDIT) && (
                          <button
                            onClick={() => abrirModalEditar(orden)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {can(RESOURCES.ORDENES, ACTIONS.DELETE) && (
                          <button
                            onClick={() => handleEliminar(orden.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {ordenesFiltradas.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Mostrando {ordenesFiltradas.length} de {ordenes.length} órdenes
            </p>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={cerrarModal}
        title={editingOrden ? "Editar Orden" : "Nueva Orden"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                required
                value={formData.cliente_id}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    cliente_id: e.target.value,
                    dispositivo_id: "" // Resetear dispositivo al cambiar cliente
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo}
                  </option>
                ))}
              </select>
            </div>

            {/* Dispositivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispositivo *
              </label>
              <select
                required
                value={formData.dispositivo_id}
                onChange={(e) =>
                  setFormData({ ...formData, dispositivo_id: e.target.value })
                }
                disabled={!formData.cliente_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!formData.cliente_id 
                    ? "Primero selecciona un cliente" 
                    : dispositivosFiltrados.length === 0
                    ? "Este cliente no tiene dispositivos"
                    : "Selecciona un dispositivo"
                  }
                </option>
                {dispositivosFiltrados.map((disp) => (
                  <option key={disp.id} value={disp.id}>
                    {disp.marca_nombre} {disp.modelo_nombre} - {disp.imei || "Sin IMEI"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción del Problema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Problema *
            </label>
            <textarea
              required
              value={formData.descripcion_problema}
              onChange={(e) =>
                setFormData({ ...formData, descripcion_problema: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Describe el problema del dispositivo..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado_actual_id}
                onChange={(e) =>
                  setFormData({ ...formData, estado_actual_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Estado por defecto (Recibido)</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.etiqueta_publica}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                required
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({ ...formData, prioridad: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Técnico Asignado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnico Asignado
              </label>
              <select
                value={formData.tecnico_asignado}
                onChange={(e) =>
                  setFormData({ ...formData, tecnico_asignado: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Sin asignar</option>
                {usuarios
                  .filter((u) => u.rol_nombre === "Técnico")
                  .map((tecnico) => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.nombre_completo}
                    </option>
                  ))}
              </select>
            </div>

            {/* Fecha Entrega Estimada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Entrega Estimada
              </label>
              <input
                type="date"
                value={formData.fecha_entrega_estimada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_entrega_estimada: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 font-medium transition-all shadow-lg shadow-orange-500/30"
            >
              {editingOrden ? "Actualizar" : "Crear"} Orden
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Ver Detalles */}
      <Modal
        isOpen={showDetallesModal}
        onClose={() => {
          setShowDetallesModal(false);
          setOrdenDetalles(null);
        }}
        title="Detalles de la Orden"
        size="lg"
      >
        {ordenDetalles && (
          <div className="space-y-6">
            {/* Cliente y Dispositivo */}
            <div className="grid grid-cols-2 gap-4">
              {/* Cliente */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Cliente</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-medium">{ordenDetalles.cliente?.nombre_completo}</p>
                  <p className="text-gray-600 text-sm">📞 {ordenDetalles.cliente?.telefono}</p>
                  {ordenDetalles.cliente?.correo && (
                    <p className="text-gray-600 text-sm">✉️ {ordenDetalles.cliente.correo}</p>
                  )}
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
                    {ordenDetalles.dispositivo?.marca_nombre} {ordenDetalles.dispositivo?.modelo_nombre}
                  </p>
                  {ordenDetalles.dispositivo?.imei && (
                    <p className="text-gray-600 text-sm">📱 IMEI: {ordenDetalles.dispositivo.imei}</p>
                  )}
                  {ordenDetalles.dispositivo?.color && (
                    <p className="text-gray-600 text-sm">🎨 Color: {ordenDetalles.dispositivo.color}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Problema Reportado */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Problema Reportado</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {ordenDetalles.descripcion_problema}
              </p>
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
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {ordenDetalles.estado?.etiqueta_publica}
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
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  ordenDetalles.prioridad === 'alta' || ordenDetalles.prioridad === 'urgente'
                    ? 'bg-red-500 text-white'
                    : ordenDetalles.prioridad === 'normal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {ordenDetalles.prioridad?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Técnico Asignado */}
            {ordenDetalles.tecnico && (
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-500 p-2 rounded-lg">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Técnico Asignado</h3>
                </div>
                <p className="text-gray-900 font-medium">{ordenDetalles.tecnico.nombre_completo}</p>
              </div>
            )}

            {/* Fecha de Entrega Estimada */}
            {ordenDetalles.fecha_entrega_estimada && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">Fecha de Entrega Estimada</h3>
                </div>
                <p className="text-gray-900 font-medium">
                  📅 {new Date(ordenDetalles.fecha_entrega_estimada).toLocaleDateString('es-GT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Componente oculto para impresión */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {ordenDetalles && (
          <TicketOrden
            ref={ticketRef}
            orden={ordenDetalles}
            cliente={ordenDetalles.cliente}
            dispositivo={ordenDetalles.dispositivo}
            estado={ordenDetalles.estado}
          />
        )}
      </div>

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

export default OrdenesPage;