import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Search, Shield, UserCheck, UserX, Eye, EyeOff } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import api from "../../services/api";
import Modal from "../../components/shared/Modal";
import ToastContainer from "../../components/shared/ToastContainer";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

function UsuariosPage() {
  const { can, RESOURCES, ACTIONS } = usePermissions();
  const { toasts, removeToast, success, error } = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    telefono: "",
    rol_id: "",
    activo: true,
    password: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosRes, rolesRes] = await Promise.all([
        api.get("/usuarios"),
        api.get("/roles"),
      ]);
      setUsuarios(usuariosRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        nombre_completo: formData.nombre_completo,
        correo: formData.correo || "",
        telefono: formData.telefono || "",
        rol_id: formData.rol_id,
        activo: formData.activo,
      };

      // Agregar contraseña solo si se proporcionó
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (editingUsuario) {
        await api.patch(`/usuarios/${editingUsuario.id}`, dataToSend);
        success("Usuario actualizado exitosamente");
      } else {
        await api.post("/usuarios", dataToSend);
        success("Usuario creado exitosamente");
      }

      cargarDatos();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      error(err.response?.data?.error || "Error al guardar usuario");
    }
  };

  const handleEliminar = async (id) => {
    const confirmed = await confirm({
      title: "Eliminar Usuario",
      message: "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/usuarios/${id}`);
      success("Usuario eliminado exitosamente");
      cargarDatos();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      error(err.response?.data?.error || "Error al eliminar usuario");
    }
  };

  const toggleActivo = async (usuario) => {
    try {
      await api.patch(`/usuarios/${usuario.id}`, {
        activo: !usuario.activo,
      });
      success(`Usuario ${usuario.activo ? "desactivado" : "activado"} exitosamente`);
      cargarDatos();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      error("Error al cambiar estado del usuario");
    }
  };

  const abrirModalNuevo = () => {
    setEditingUsuario(null);
    setShowPassword(false);
    setFormData({
      nombre_completo: "",
      correo: "",
      telefono: "",
      rol_id: "",
      activo: true,
      password: "",
    });
    setShowModal(true);
  };

  const abrirModalEditar = (usuario) => {
    setEditingUsuario(usuario);
    setShowPassword(false);
    setFormData({
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo || "",
      telefono: usuario.telefono || "",
      rol_id: usuario.rol_id,
      activo: usuario.activo,
      password: "", // Vacío al editar, solo se cambia si se ingresa nueva
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setShowPassword(false);
    setFormData({
      nombre_completo: "",
      correo: "",
      telefono: "",
      rol_id: "",
      activo: true,
      password: "",
    });
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const nombre = usuario.nombre_completo || "";
    const correo = usuario.correo || "";
    const telefono = usuario.telefono || "";
    const rol = usuario.rol_nombre || "";
    return (
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telefono.includes(searchTerm) ||
      rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getRolColor = (rolNombre) => {
    switch (rolNombre) {
      case "Administrador":
        return "bg-red-100 text-red-700";
      case "Técnico":
        return "bg-blue-100 text-blue-700";
      case "Recepcionista":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestión de Usuarios</h1>
            <p className="text-indigo-100">
              Administra los usuarios del sistema y sus roles
            </p>
          </div>
          <Users className="w-12 h-12" />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-red-600">
                {usuarios.filter((u) => u.rol_nombre === "Administrador").length}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Técnicos</p>
              <p className="text-2xl font-bold text-blue-600">
                {usuarios.filter((u) => u.rol_nombre === "Técnico").length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recepcionistas</p>
              <p className="text-2xl font-bold text-green-600">
                {usuarios.filter((u) => u.rol_nombre === "Recepcionista").length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
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
              placeholder="Buscar por nombre, correo, teléfono, rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Botón Nuevo Usuario */}
          {can(RESOURCES.USUARIOS, ACTIONS.CREATE) && (
            <button
              onClick={abrirModalNuevo}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Usuario
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
            {can(RESOURCES.USUARIOS, ACTIONS.CREATE) && !searchTerm && (
              <button
                onClick={abrirModalNuevo}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Crear el primer usuario
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  {(can(RESOURCES.USUARIOS, ACTIONS.EDIT) ||
                    can(RESOURCES.USUARIOS, ACTIONS.DELETE)) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {usuario.nombre_completo.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre_completo}
                          </div>
                          <div className="text-xs text-gray-500">ID: {usuario.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.correo || "-"}</div>
                      <div className="text-xs text-gray-500">{usuario.telefono || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRolColor(
                          usuario.rol_nombre
                        )}`}
                      >
                        {usuario.rol_nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActivo(usuario)}
                        disabled={!can(RESOURCES.USUARIOS, ACTIONS.EDIT)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          usuario.activo
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } ${
                          !can(RESOURCES.USUARIOS, ACTIONS.EDIT)
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        {usuario.activo ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    {(can(RESOURCES.USUARIOS, ACTIONS.EDIT) ||
                      can(RESOURCES.USUARIOS, ACTIONS.DELETE)) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {can(RESOURCES.USUARIOS, ACTIONS.EDIT) && (
                            <button
                              onClick={() => abrirModalEditar(usuario)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {can(RESOURCES.USUARIOS, ACTIONS.DELETE) && (
                            <button
                              onClick={() => handleEliminar(usuario.id)}
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
        title={editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
        size="md"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ej: Juan Pérez"
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
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              autoComplete="off"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="1234-5678"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              required
              value={formData.rol_id}
              onChange={(e) => setFormData({ ...formData, rol_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña {!editingUsuario && "*"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required={!editingUsuario}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder={editingUsuario ? "Dejar en blanco para no cambiar" : "Ingresa una contraseña"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {editingUsuario && (
              <p className="text-xs text-gray-500 mt-1">
                Solo completa este campo si deseas cambiar la contraseña
              </p>
            )}
          </div>

          {/* Estado Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="activo" className="ml-2 text-sm text-gray-700">
              Usuario activo
            </label>
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
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 font-medium transition-all shadow-lg shadow-indigo-500/30"
            >
              {editingUsuario ? "Actualizar" : "Crear"} Usuario
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

export default UsuariosPage;