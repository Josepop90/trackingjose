import { useState, useEffect } from "react";
import { Smartphone, Plus, Edit, Trash2, Search, User } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function DispositivosPage() {
  const { can, RESOURCES, ACTIONS } = usePermissions();
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [dispositivos, setDispositivos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDispositivo, setEditingDispositivo] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: "",
    marca_id: "",
    modelo_id: "",
    imei: "",
    color: "",
    notas: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Cargar dispositivos, clientes, marcas y modelos en paralelo
      const [dispositivosRes, clientesRes, marcasRes, modelosRes] = await Promise.all([
        api.get("/dispositivos"),
        api.get("/clientes"),
        api.get("/marcas"),
        api.get("/modelos"),
      ]);
      setDispositivos(dispositivosRes.data);
      setClientes(clientesRes.data);
      setMarcas(marcasRes.data);
      setModelos(modelosRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcaChange = (marcaId) => {
    setFormData({ ...formData, marca_id: marcaId, modelo_id: "" });
    // Filtrar modelos por marca seleccionada
    if (marcaId) {
      const modelosPorMarca = modelos.filter((m) => m.marca_id == marcaId);
      setModelosFiltrados(modelosPorMarca);
    } else {
      setModelosFiltrados([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Asegurar que todos los campos tengan valores
      const dataToSend = {
        cliente_id: formData.cliente_id,
        marca_id: formData.marca_id || null,
        modelo_id: formData.modelo_id || null,
        imei: formData.imei || "",
        color: formData.color || "",
        notas: formData.notas || "",
      };

      if (editingDispositivo) {
        // Editar dispositivo
        await api.patch(`/dispositivos/${editingDispositivo.id}`, dataToSend);
        toast.success("Dispositivo actualizado exitosamente");
      } else {
        // Crear nuevo dispositivo
        await api.post("/dispositivos", dataToSend);
        toast.success("Dispositivo creado exitosamente");
      }

      cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar dispositivo:", error);
      toast.error(error.response?.data?.error || "Error al guardar dispositivo");
    }
  };

  const handleEliminar = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Dispositivo",
      message: "¿Estás seguro de eliminar este dispositivo? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });

    if (!confirmed) return;

    try {
      await api.delete(`/dispositivos/${id}`);
      toast.success("Dispositivo eliminado exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar dispositivo:", error);
      toast.error(error.response?.data?.error || "Error al eliminar dispositivo");
    }
  };

  const abrirModalNuevo = () => {
    setEditingDispositivo(null);
    setFormData({
      cliente_id: "",
      marca_id: "",
      modelo_id: "",
      imei: "",
      color: "",
      notas: "",
    });
    setShowModal(true);
  };

  const abrirModalEditar = (dispositivo) => {
    setEditingDispositivo(dispositivo);
    setFormData({
      cliente_id: dispositivo.cliente_id,
      marca_id: dispositivo.marca_id || "",
      modelo_id: dispositivo.modelo_id || "",
      imei: dispositivo.imei || "",
      color: dispositivo.color || "",
      notas: dispositivo.notas || "",
    });
    // Filtrar modelos si hay marca seleccionada
    if (dispositivo.marca_id) {
      const modelosPorMarca = modelos.filter((m) => m.marca_id == dispositivo.marca_id);
      setModelosFiltrados(modelosPorMarca);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingDispositivo(null);
  };

  const getClienteNombre = (dispositivo) => {
    // Si viene del JOIN, usar cliente_nombre directamente
    if (dispositivo.cliente_nombre) {
      return dispositivo.cliente_nombre;
    }
    // Si no, buscar en el array de clientes
    const cliente = clientes.find((c) => c.id === dispositivo.cliente_id);
    return cliente?.nombre_completo || `Cliente #${dispositivo.cliente_id}`;
  };

  const dispositivosFiltrados = dispositivos.filter((dispositivo) => {
    const clienteNombre = getClienteNombre(dispositivo);
    const marca = dispositivo.marca_nombre || "";
    const modelo = dispositivo.modelo_nombre || "";
    return (
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dispositivo.imei && dispositivo.imei.includes(searchTerm))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dispositivos...</p>
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
            <h1 className="text-2xl font-bold mb-2">Gestión de Dispositivos</h1>
            <p className="text-purple-100">
              Administra los dispositivos móviles ingresados
            </p>
          </div>
          <Smartphone className="w-12 h-12" />
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, marca, modelo o IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Botón Nuevo Dispositivo */}
          {can(RESOURCES.DISPOSITIVOS, ACTIONS.CREATE) && (
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Dispositivo
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Dispositivos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {dispositivosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No se encontraron dispositivos"
                : "No hay dispositivos registrados"}
            </p>
            {can(RESOURCES.DISPOSITIVOS, ACTIONS.CREATE) && !searchTerm && (
              <button
                onClick={abrirModalNuevo}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Registrar el primer dispositivo
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMEI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  {(can(RESOURCES.DISPOSITIVOS, ACTIONS.EDIT) ||
                    can(RESOURCES.DISPOSITIVOS, ACTIONS.DELETE)) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dispositivosFiltrados.map((dispositivo) => (
                  <tr
                    key={dispositivo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getClienteNombre(dispositivo)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {dispositivo.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dispositivo.marca_nombre || (
                          <span className="text-gray-400">Sin marca</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dispositivo.modelo_nombre || (
                          <span className="text-gray-400">Sin modelo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dispositivo.imei || (
                          <span className="text-gray-400">Sin IMEI</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dispositivo.color ? (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {dispositivo.color}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin color</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {dispositivo.notas || (
                          <span className="text-gray-400">Sin notas</span>
                        )}
                      </div>
                    </td>
                    {(can(RESOURCES.DISPOSITIVOS, ACTIONS.EDIT) ||
                      can(RESOURCES.DISPOSITIVOS, ACTIONS.DELETE)) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {can(RESOURCES.DISPOSITIVOS, ACTIONS.EDIT) && (
                            <button
                              onClick={() => abrirModalEditar(dispositivo)}
                              className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {can(RESOURCES.DISPOSITIVOS, ACTIONS.DELETE) && (
                            <button
                              onClick={() => handleEliminar(dispositivo.id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={cerrarModal}
        title={editingDispositivo ? "Editar Dispositivo" : "Nuevo Dispositivo"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              required
              value={formData.cliente_id}
              onChange={(e) =>
                setFormData({ ...formData, cliente_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre_completo} - {cliente.telefono}
                </option>
              ))}
            </select>
          </div>

          {/* IMEI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IMEI
            </label>
            <input
              type="text"
              value={formData.imei}
              onChange={(e) =>
                setFormData({ ...formData, imei: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="123456789012345"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Negro, Blanco, Azul..."
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <select
              value={formData.marca_id}
              onChange={(e) => handleMarcaChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <select
              value={formData.modelo_id}
              onChange={(e) =>
                setFormData({ ...formData, modelo_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              disabled={!formData.marca_id}
            >
              <option value="">
                {formData.marca_id ? "Selecciona un modelo" : "Primero selecciona una marca"}
              </option>
              {modelosFiltrados.map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Observaciones del dispositivo..."
            />
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
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-medium transition-all shadow-lg shadow-purple-500/30"
            >
              {editingDispositivo ? "Actualizar" : "Crear"} Dispositivo
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

export default DispositivosPage;