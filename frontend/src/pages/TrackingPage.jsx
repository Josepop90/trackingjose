import { useState, useEffect } from "react";
import { Search, Package, Clock, CheckCircle, User, Calendar, FileText, AlertCircle, Wrench, UserCheck, PackageCheck, Timer } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function TrackingPage() {
  const { ordenId } = useParams();
  const navigate = useNavigate();
  const [codigoBusqueda, setCodigoBusqueda] = useState(ordenId || "");
  const [orden, setOrden] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ordenId) {
      buscarOrden(ordenId);
    }
  }, [ordenId]);

  const buscarOrden = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const idLimpio = id.trim();
      
      // Endpoint público
      const response = await api.get(`/ordenes/tracking/${idLimpio}`);
      setOrden(response.data.orden);
      setHistorial(response.data.historial || []);
      
      // Actualizar URL si es necesario
      if (response.data.orden.id && ordenId !== response.data.orden.id.toString()) {
        window.history.replaceState(null, '', `/consulta/${response.data.orden.id}`);
      }
    } catch (err) {
      console.error("Error al buscar orden:", err);
      setError("No se encontró la orden. Verifica el código e intenta nuevamente.");
      setOrden(null);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (codigoBusqueda.trim()) {
      const codigo = codigoBusqueda.trim();
      navigate(`/consulta/${codigo}`);
      buscarOrden(codigo);
    }
  };

  const getEstadoColor = (estadoNombre) => {
    if (!estadoNombre) return "bg-gray-100 text-gray-700 border-gray-300";
    const lower = estadoNombre.toLowerCase();
    if (lower.includes("recibido") || lower.includes("pendiente"))
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (lower.includes("diagnóstico") || lower.includes("diagnostico"))
      return "bg-blue-100 text-blue-700 border-blue-300";
    if (lower.includes("proceso") || lower.includes("reparación") || lower.includes("reparacion"))
      return "bg-purple-100 text-purple-700 border-purple-300";
    if (lower.includes("esperando") || lower.includes("repuesto"))
      return "bg-amber-100 text-amber-700 border-amber-300";
    if (lower.includes("completado") || lower.includes("listo") || lower.includes("finaliza"))
      return "bg-green-100 text-green-700 border-green-300";
    if (lower.includes("entregado"))
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    if (lower.includes("cancelado"))
      return "bg-red-100 text-red-700 border-red-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getEstadoIconHistorial = (estadoNombre) => {
    if (!estadoNombre) return <Clock className="w-5 h-5" />;
    const lower = estadoNombre.toLowerCase();
    
    if (lower.includes("entregado"))
      return <PackageCheck className="w-5 h-5" />;
    if (lower.includes("completado") || lower.includes("listo") || lower.includes("finaliza"))
      return <CheckCircle className="w-5 h-5" />;
    if (lower.includes("proceso") || lower.includes("reparación") || lower.includes("reparacion"))
      return <Wrench className="w-5 h-5" />;
    if (lower.includes("diagnóstico") || lower.includes("diagnostico"))
      return <FileText className="w-5 h-5" />;
    if (lower.includes("esperando") || lower.includes("repuesto"))
      return <Timer className="w-5 h-5" />;
    if (lower.includes("recibido") || lower.includes("pendiente"))
      return <Package className="w-5 h-5" />;
    if (lower.includes("cancelado"))
      return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getEstadoIcon = (estadoNombre) => {
    if (!estadoNombre) return <Clock className="w-5 h-5" />;
    const lower = estadoNombre.toLowerCase();
    if (lower.includes("completado") || lower.includes("entregado") || lower.includes("listo"))
      return <CheckCircle className="w-5 h-5" />;
    if (lower.includes("proceso") || lower.includes("reparación") || lower.includes("reparacion"))
      return <Package className="w-5 h-5" />;
    if (lower.includes("diagnóstico") || lower.includes("diagnostico"))
      return <FileText className="w-5 h-5" />;
    if (lower.includes("cancelado"))
      return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header mejorado y compacto */}
        <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
          {/* Logo y título en una sola línea */}
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-2xl px-6 py-4 mb-4 hover:shadow-cyan-500/50 transition-all duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">VC</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Tecnología Virtual Cel
              </h1>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Tracking de seguimiento de progreso de estados
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de búsqueda compacto */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-10 animate-slideUp">
          <form onSubmit={handleBuscar} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Código de Seguimiento
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={codigoBusqueda}
                  onChange={(e) => setCodigoBusqueda(e.target.value)}
                  placeholder="Ingresa tu código..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-sm sm:text-base"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-105 active:scale-95"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>💡</span>
              <span>Escanea el código QR o ingresa el número de orden</span>
            </p>
          </form>
        </div>

        {/* Loading con animación */}
        {loading && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Buscando orden...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 animate-shake">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">No se encontró la orden</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultado */}
        {orden && !loading && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* Tarjeta principal de la orden */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
              {/* Header de la orden */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-cyan-100 text-xs sm:text-sm font-medium mb-1">Orden de Reparación</p>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      #{orden.id}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    {getEstadoIcon(orden.estado_nombre)}
                    <span className="bg-white/20 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-white/30">
                      {orden.estado_nombre}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido de la orden - Grid responsivo mejorado */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Cliente */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Cliente</span>
                    </div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base break-words">{orden.cliente_nombre}</p>
                  </div>

                  {/* Dispositivo */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Dispositivo</span>
                    </div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base break-words">
                      {orden.marca_nombre} {orden.modelo_nombre}
                    </p>
                    {orden.color && (
                      <p className="text-gray-600 text-xs mt-1 break-words">Color: {orden.color}</p>
                    )}
                  </div>

                  {/* Fecha de Ingreso */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Fecha de Ingreso</span>
                    </div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base break-words">
                      {formatDate(orden.creado_en)}
                    </p>
                  </div>

                  {/* Prioridad */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Prioridad</span>
                    </div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base capitalize break-words">{orden.prioridad}</p>
                    {orden.fecha_entrega_estimada && (
                      <p className="text-gray-600 text-xs mt-1 break-words">
                        Entrega: {formatDate(orden.fecha_entrega_estimada)}
                      </p>
                    )}
                  </div>

                  {/* Técnico Asignado */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-500 p-2 rounded-lg">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Técnico Asignado</span>
                    </div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base capitalize break-words">
                      {orden.tecnico_nombre || "Sin asignar"}
                    </p>
                  </div>

                  {/* Problema Reportado */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-500 p-2 rounded-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Problema Reportado</span>
                    </div>
                    <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-relaxed break-words">
                      {orden.descripcion_problema || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de estados */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                  <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                Historial de Estados
              </h3>

              {historial.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No hay historial disponible aún</p>
                  <p className="text-gray-400 text-sm mt-2">Los cambios de estado aparecerán aquí</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 sm:left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-600 rounded-full"></div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {(() => {
                      // Ordenar por fecha descendente y eliminar duplicados
                      const ordenados = [...historial].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
                      const estadosVistos = new Set();
                      const sinDuplicados = ordenados.filter(item => {
                        const clave = item.estado_destino_nombre;
                        if (estadosVistos.has(clave)) return false;
                        estadosVistos.add(clave);
                        return true;
                      });
                      
                      return sinDuplicados.map((item, index) => {
                        const esEstadoActual = index === 0 && (
                          item.estado_destino_id === orden.estado_actual_id || 
                          item.estado_destino_nombre === orden.estado_nombre
                        );
                        
                        return (
                          <div
                            key={item.id}
                            className="relative pl-14 sm:pl-20 group animate-slideIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {/* Icono del estado */}
                            <div className={`absolute left-1 sm:left-2 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-200 ${getEstadoColor(item.estado_destino_nombre).replace('border-', 'bg-').split(' ')[0]}`}>
                              <div className="transform scale-90 sm:scale-110">
                                {getEstadoIconHistorial(item.estado_destino_nombre)}
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-gray-100 hover:border-cyan-300 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 flex-wrap">
                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                  <span className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold border-2 flex items-center gap-2 shadow-sm ${getEstadoColor(item.estado_destino_nombre)}`}>
                                    <div className="transform scale-90 sm:scale-110">
                                      {getEstadoIconHistorial(item.estado_destino_nombre)}
                                    </div>
                                    <span className="hidden sm:inline">{item.estado_destino_nombre}</span>
                                    <span className="sm:hidden">{item.estado_destino_nombre.split(' ')[0]}</span>
                                  </span>
                                  {esEstadoActual && (
                                    <span className="bg-green-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full animate-pulse shadow-lg">
                                      ✓ Actual
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500 font-semibold whitespace-nowrap">
                                  📅 {formatDateTime(item.creado_en)}
                                </span>
                              </div>

                              {item.nota && (
                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-blue-100 mt-3">
                                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">💬 {item.nota}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Footer informativo */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-200">
              <h4 className="font-bold text-base sm:text-lg mb-2">¿Necesitas más información?</h4>
              <p className="text-cyan-100 mb-4 text-sm sm:text-base">
                Contáctanos: Tel. 7721-7169 | Santiago Atitlán
              </p>
              <p className="text-xs sm:text-sm text-cyan-100">
                ¡Gracias por confiar en Tecnología Virtual Cel!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estilos de animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default TrackingPage;