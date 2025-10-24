import { useState, useEffect } from "react";
import { History, Search, Filter, Calendar, User, ArrowRight } from "lucide-react";
import api from "../../services/api";

function HistorialPage() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("todos"); // todos, hoy, semana, mes

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await api.get("/historial");
      setHistorial(response.data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  const historialFiltrado = historial.filter((item) => {
    // Filtro por búsqueda
    const cliente = item.cliente_nombre || "";
    const dispositivo = `${item.marca_nombre || ""} ${item.modelo_nombre || ""}`;
    const tecnico = item.tecnico_nombre || "";
    const estadoOrigen = item.estado_origen_nombre || "";
    const estadoDestino = item.estado_destino_nombre || "";
    const nota = item.nota || "";

    const cumpleBusqueda =
      cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispositivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estadoOrigen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estadoDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.orden_id && item.orden_id.toString().includes(searchTerm));

    if (!cumpleBusqueda) return false;

    // Filtro por fecha
    if (filtroFecha === "todos") return true;

    const fechaItem = new Date(item.creado_en);
    const ahora = new Date();

    if (filtroFecha === "hoy") {
      return (
        fechaItem.getDate() === ahora.getDate() &&
        fechaItem.getMonth() === ahora.getMonth() &&
        fechaItem.getFullYear() === ahora.getFullYear()
      );
    }

    if (filtroFecha === "semana") {
      const unaSemanaAtras = new Date();
      unaSemanaAtras.setDate(ahora.getDate() - 7);
      return fechaItem >= unaSemanaAtras;
    }

    if (filtroFecha === "mes") {
      const unMesAtras = new Date();
      unMesAtras.setMonth(ahora.getMonth() - 1);
      return fechaItem >= unMesAtras;
    }

    return true;
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

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-GT", opciones);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Historial de Cambios</h1>
            <p className="text-teal-100">
              Registro completo de todos los cambios de estado
            </p>
          </div>
          <History className="w-12 h-12" />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cambios</p>
              <p className="text-2xl font-bold text-gray-900">{historial.length}</p>
            </div>
            <div className="bg-teal-100 rounded-full p-3">
              <History className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-teal-600">
                {
                  historial.filter((h) => {
                    const fecha = new Date(h.creado_en);
                    const hoy = new Date();
                    return (
                      fecha.getDate() === hoy.getDate() &&
                      fecha.getMonth() === hoy.getMonth() &&
                      fecha.getFullYear() === hoy.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
            <div className="bg-teal-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-cyan-600">
                {
                  historial.filter((h) => {
                    const fecha = new Date(h.creado_en);
                    const unaSemanaAtras = new Date();
                    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
                    return fecha >= unaSemanaAtras;
                  }).length
                }
              </p>
            </div>
            <div className="bg-cyan-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  historial.filter((h) => {
                    const fecha = new Date(h.creado_en);
                    const unMesAtras = new Date();
                    unMesAtras.setMonth(unMesAtras.getMonth() - 1);
                    return fecha >= unMesAtras;
                  }).length
                }
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por orden, cliente, técnico, estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filtro por fecha */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroFecha("todos")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroFecha === "todos"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroFecha("hoy")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroFecha === "hoy"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setFiltroFecha("semana")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroFecha === "semana"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setFiltroFecha("mes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroFecha === "mes"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Timeline de Historial */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {historialFiltrado.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No se encontraron registros"
                : "No hay historial disponible"}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {historialFiltrado.map((item, index) => (
                <div
                  key={item.id}
                  className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-transparent"
                >
                  {/* Icono en la línea de tiempo */}
                  <div className="absolute left-0 top-0 -ml-2 w-4 h-4 flex items-center justify-center">
                    <History className="w-4 h-4 text-teal-500" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-teal-600">
                            Orden #{item.orden_id}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-sm text-gray-700">
                            {item.cliente_nombre}
                          </span>
                        </div>

                        {/* Cambio de estado */}
                        <div className="flex items-center gap-2 mb-2">
                          {item.estado_origen_nombre ? (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                                item.estado_origen_nombre
                              )}`}
                            >
                              {item.estado_origen_nombre}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                              Inicio
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                              item.estado_destino_nombre
                            )}`}
                          >
                            {item.estado_destino_nombre}
                          </span>
                        </div>

                        {/* Dispositivo */}
                        {(item.marca_nombre || item.modelo_nombre) && (
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Dispositivo:</span>{" "}
                            {item.marca_nombre} {item.modelo_nombre}
                            {item.dispositivo_imei && ` - IMEI: ${item.dispositivo_imei}`}
                          </div>
                        )}

                        {/* Nota */}
                        {item.nota && (
                          <div className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border-l-2 border-teal-500">
                            {item.nota}
                          </div>
                        )}

                        {/* Técnico */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>
                            {item.tecnico_nombre || "Sistema automático"}
                          </span>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>{formatearFecha(item.creado_en)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Información */}
      {historialFiltrado.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Filter className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-teal-900">
                Mostrando {historialFiltrado.length} de {historial.length} registros
              </p>
              <p className="text-xs text-teal-700 mt-1">
                Usa los filtros para refinar tu búsqueda
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistorialPage;
