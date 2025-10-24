import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, CheckCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function NewLoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(correo, password);

      if (result.success) {
        console.log("Login exitoso:", result.user);
        navigate("/dashboard");
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* SECCIÓN IZQUIERDA - Hero Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-20 relative overflow-hidden">
        {/* Fondo de circuitos tecnológicos */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                {/* Líneas horizontales */}
                <line x1="0" y1="50" x2="200" y2="50" stroke="currentColor" strokeWidth="1" className="text-cyan-500" opacity="0.3"/>
                <line x1="0" y1="150" x2="200" y2="150" stroke="currentColor" strokeWidth="1" className="text-cyan-500" opacity="0.3"/>
                
                {/* Líneas verticales */}
                <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" strokeWidth="1" className="text-cyan-500" opacity="0.3"/>
                <line x1="150" y1="0" x2="150" y2="200" stroke="currentColor" strokeWidth="1" className="text-cyan-500" opacity="0.3"/>
                
                {/* Nodos/Puntos de conexión */}
                <circle cx="50" cy="50" r="3" fill="currentColor" className="text-cyan-400" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="150" cy="50" r="3" fill="currentColor" className="text-blue-400" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="150" r="3" fill="currentColor" className="text-blue-400" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="150" cy="150" r="3" fill="currentColor" className="text-cyan-400" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite"/>
                </circle>
                
                {/* Conexiones diagonales */}
                <line x1="50" y1="50" x2="150" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" opacity="0.2"/>
                <line x1="150" y1="50" x2="50" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" opacity="0.2"/>
                
                {/* Micro circuitos */}
                <path d="M 80 50 L 100 50 L 100 70 L 120 70" stroke="currentColor" strokeWidth="1" fill="none" className="text-cyan-400" opacity="0.4"/>
                <path d="M 80 150 L 100 150 L 100 130 L 120 130" stroke="currentColor" strokeWidth="1" fill="none" className="text-blue-400" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>
          </svg>
        </div>

        {/* Efectos de luz adicionales */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>

        <div className="max-w-lg mx-auto relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
              <div className="text-white font-bold text-2xl">VC</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tecnología</h2>
              <p className="text-cyan-400 text-sm font-medium">Virtual Cel</p>
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Bienvenido al <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Tracking</span> del Progreso de Estado de las Reparaciones Móviles
          </h1>

          {/* Roles del sistema */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">Administrador</p>
                  <p className="text-slate-400 text-sm">Dashboard completo, creación y gestión de roles de usuario</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">Técnico</p>
                  <p className="text-slate-400 text-sm">Visualización y actualización del progreso de reparaciones</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-purple-500/50 transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">Recepcionista</p>
                  <p className="text-slate-400 text-sm">Registro de clientes, dispositivos y generación de tickets con QR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-sm text-slate-400 border-t border-slate-700/50 pt-6">
            © 2025 Tecnología Virtual Cel. Todos los derechos reservados.
          </footer>
        </div>
      </div>

      {/* SECCIÓN DERECHA - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 border border-slate-200">
          {/* Header del formulario */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
            <p className="text-slate-600">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de Correo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="usuario@virtualcel.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white hover:border-slate-300 text-slate-800 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white hover:border-slate-300 text-slate-800 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Recordarme */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 select-none">
                  Recordarme en este dispositivo
                </span>
              </label>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Info adicional */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Sistema de gestión de reparaciones móviles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewLoginPage;