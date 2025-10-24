import { useState, useEffect } from "react";
import { Settings, Plus, Edit, Trash2, Smartphone, Tag } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function ConfiguracionPage() {
  const toast = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showModeloModal, setShowModeloModal] = useState(false);

  // Edición
  const [editingMarca, setEditingMarca] = useState(null);
  const [editingModelo, setEditingModelo] = useState(null);

  // Formularios
  const [formMarca, setFormMarca] = useState({ nombre: "" });
  const [formModelo, setFormModelo] = useState({ nombre: "", marca_id: "" });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [marcasRes, modelosRes] = await Promise.all([
        api.get("/marcas"),
        api.get("/modelos"),
      ]);
      setMarcas(marcasRes.data);
      setModelos(modelosRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // ========== MARCAS ==========
  const abrirModalNuevaMarca = () => {
    setEditingMarca(null);
    setFormMarca({ nombre: "" });
    setShowMarcaModal(true);
  };

  const abrirModalEditarMarca = (marca) => {
    setEditingMarca(marca);
    setFormMarca({ nombre: marca.nombre });
    setShowMarcaModal(true);
  };

  const handleSubmitMarca = async (e) => {
    e.preventDefault();
    try {
      if (editingMarca) {
        await api.patch(`/marcas/${editingMarca.id}`, formMarca);
        toast.success("Marca actualizada exitosamente");
      } else {
        await api.post("/marcas", formMarca);
        toast.success("Marca creada exitosamente");
      }
      cargarDatos();
      setShowMarcaModal(false);
    } catch (error) {
      console.error("Error al guardar marca:", error);
      toast.error(error.response?.data?.error || "Error al guardar marca");
    }
  };

  const handleEliminarMarca = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Marca",
      message: "¿Estás seguro de eliminar esta marca? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });

    if (!confirmed) return;

    try {
      await api.delete(`/marcas/${id}`);
      toast.success("Marca eliminada exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar marca:", error);
      toast.error(error.response?.data?.error || "Error al eliminar marca");
    }
  };

  // ========== MODELOS ==========
  const abrirModalNuevoModelo = () => {
    setEditingModelo(null);
    setFormModelo({ nombre: "", marca_id: "" });
    setShowModeloModal(true);
  };

  const abrirModalEditarModelo = (modelo) => {
    setEditingModelo(modelo);
    setFormModelo({ nombre: modelo.nombre, marca_id: modelo.marca_id });
    setShowModeloModal(true);
  };

  const handleSubmitModelo = async (e) => {
    e.preventDefault();
    try {
      if (editingModelo) {
        await api.patch(`/modelos/${editingModelo.id}`, formModelo);
        toast.success("Modelo actualizado exitosamente");
      } else {
        await api.post("/modelos", formModelo);
        toast.success("Modelo creado exitosamente");
      }
      cargarDatos();
      setShowModeloModal(false);
    } catch (error) {
      console.error("Error al guardar modelo:", error);
      toast.error(error.response?.data?.error || "Error al guardar modelo");
    }
  };

  const handleEliminarModelo = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Modelo",
      message: "¿Estás seguro de eliminar este modelo? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Eliminar",
      cancelText: "Cancelar"
    });

    if (!confirmed) return;

    try {
      await api.delete(`/modelos/${id}`);
      toast.success("Modelo eliminado exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar modelo:", error);
      toast.error(error.response?.data?.error || "Error al eliminar modelo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Configuración del Sistema</h1>
            <p className="text-slate-100">
              Gestiona marcas y modelos de dispositivos
            </p>
          </div>
          <Settings className="w-12 h-12" />
        </div>
      </div>

      {/* Sección Marcas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Marcas</h2>
              <p className="text-sm text-gray-500">
                Gestiona las marcas de dispositivos
              </p>
            </div>
          </div>
          <button
            onClick={abrirModalNuevaMarca}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Marca
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marcas.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No hay marcas registradas
            </div>
          ) : (
            marcas.map((marca) => (
              <div
                key={marca.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{marca.nombre}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirModalEditarMarca(marca)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminarMarca(marca.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sección Modelos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Modelos</h2>
              <p className="text-sm text-gray-500">
                Gestiona los modelos por marca
              </p>
            </div>
          </div>
          <button
            onClick={abrirModalNuevoModelo}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Modelo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modelos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No hay modelos registrados
                  </td>
                </tr>
              ) : (
                modelos.map((modelo) => (
                  <tr key={modelo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {modelo.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {modelo.marca_nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditarModelo(modelo)}
                          className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarModelo(modelo.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Marca */}
      <Modal
        isOpen={showMarcaModal}
        onClose={() => setShowMarcaModal(false)}
        title={editingMarca ? "Editar Marca" : "Nueva Marca"}
        size="sm"
      >
        <form onSubmit={handleSubmitMarca} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Marca *
            </label>
            <input
              type="text"
              required
              value={formMarca.nombre}
              onChange={(e) => setFormMarca({ ...formMarca, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: Samsung, Apple, Xiaomi"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowMarcaModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {editingMarca ? "Actualizar" : "Crear"} Marca
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Modelo */}
      <Modal
        isOpen={showModeloModal}
        onClose={() => setShowModeloModal(false)}
        title={editingModelo ? "Editar Modelo" : "Nuevo Modelo"}
        size="sm"
      >
        <form onSubmit={handleSubmitModelo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <select
              required
              value={formModelo.marca_id}
              onChange={(e) =>
                setFormModelo({ ...formModelo, marca_id: e.target.value })
              }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Modelo *
            </label>
            <input
              type="text"
              required
              value={formModelo.nombre}
              onChange={(e) =>
                setFormModelo({ ...formModelo, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Ej: Galaxy S21, iPhone 13, Redmi Note 10"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModeloModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              {editingModelo ? "Actualizar" : "Crear"} Modelo
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

export default ConfiguracionPage;