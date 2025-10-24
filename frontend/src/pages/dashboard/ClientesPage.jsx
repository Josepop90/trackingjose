import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Search, Phone, Mail } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function ClientesPage() {
  const { can, RESOURCES, ACTIONS } = usePermissions();
  const { toasts, removeToast, success, error } = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    correo: "",
    documento_id: "",
    direccion: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Asegurar que todos los campos tengan valores (no undefined)
      const dataToSend = {
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono,
        correo: formData.correo || "",
        documento_id: formData.documento_id || "",
        direccion: formData.direccion || "",
      };

      if (editingCliente) {
        // Editar cliente (usa PATCH como en tu backend)
        await api.patch(`/clientes/${editingCliente.id}`, dataToSend);
        success("Cliente actualizado exitosamente");
      } else {
        // Crear nuevo cliente
        await api.post("/clientes", dataToSend);
        success("Cliente creado exitosamente");
      }

      cargarClientes();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      error(err.response?.data?.error || "Error al guardar cliente");
    }
  };

  const handleEliminar = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Cliente",
      message: "¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/clientes/${id}`);
      success("Cliente eliminado exitosamente");
      cargarClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      error(err.response?.data?.error || "Error al eliminar cliente");
    }
  };

  const abrirModalNuevo = () => {
    setEditingCliente(null);
    setFormData({
      nombre_completo: "",
      telefono: "",
      correo: "",
      documento_id: "",
      direccion: "",
    });
    setShowModal(true);
  };

  const abrirModalEditar = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre_completo: cliente.nombre_completo,
      telefono: cliente.telefono,
      correo: cliente.correo || "",
      documento_id: cliente.documento_id || "",
      direccion: cliente.direccion || "",
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({
      nombre_completo: "",
      telefono: "",
      correo: "",
      documento_id: "",
      direccion: "",
    });
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestión de Clientes</h1>
            <p className="text-cyan-100">
              Administra la información de tus clientes
            </p>
          </div>
          <Users className="w-12 h-12" />
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
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Botón Nuevo Cliente */}
          {can(RESOURCES.CLIENTES, ACTIONS.CREATE) && (
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
            </p>
            {can(RESOURCES.CLIENTES, ACTIONS.CREATE) && !searchTerm && (
              <button
                onClick={abrirModalNuevo}
                className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Crear el primer cliente
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
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  {(can(RESOURCES.CLIENTES, ACTIONS.EDIT) ||
                    can(RESOURCES.CLIENTES, ACTIONS.DELETE)) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {cliente.nombre_completo.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.nombre_completo}
                          </div>
                          <div className="text-xs text-gray-500">ID: {cliente.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {cliente.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cliente.correo ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {cliente.correo}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin correo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {cliente.direccion || (
                          <span className="text-gray-400">Sin dirección</span>
                        )}
                      </div>
                    </td>
                    {(can(RESOURCES.CLIENTES, ACTIONS.EDIT) ||
                      can(RESOURCES.CLIENTES, ACTIONS.DELETE)) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {can(RESOURCES.CLIENTES, ACTIONS.EDIT) && (
                            <button
                              onClick={() => abrirModalEditar(cliente)}
                              className="text-cyan-600 hover:text-cyan-900 p-2 hover:bg-cyan-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {can(RESOURCES.CLIENTES, ACTIONS.DELETE) && (
                            <button
                              onClick={() => handleEliminar(cliente.id)}
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
        title={editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={formData.nombre_completo}
              onChange={(e) =>
                setFormData({ ...formData, nombre_completo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="5551-2345"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="cliente@ejemplo.com"
            />
          </div>

          {/* Documento ID (DPI, NIT, etc.) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documento de Identidad (DPI/NIT)
            </label>
            <input
              type="text"
              value={formData.documento_id}
              onChange={(e) =>
                setFormData({ ...formData, documento_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="1234567890101"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="Calle, zona, ciudad..."
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
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all shadow-lg shadow-cyan-500/30"
            >
              {editingCliente ? "Actualizar" : "Crear"} Cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* Contenedor de Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Diálogo de Confirmación */}
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

export default ClientesPage;