import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function AccesoDenegado() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icono */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Acceso Denegado
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 mb-2">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Tu rol actual: <span className="font-semibold text-gray-700">{userRole}</span>
          </p>

          {/* Acciones */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Dashboard
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Regresar
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Si crees que deberías tener acceso, contacta al administrador
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccesoDenegado;
