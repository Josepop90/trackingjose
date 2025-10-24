import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NewLoginPage from "../pages/login/NewLoginPage";
import AccesoDenegado from "../pages/AccesoDenegado";
import TrackingPage from "../pages/TrackingPage";
import NewMainLayout from "../components/layout/NewMainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ClientesPage from "../pages/dashboard/ClientesPage";
import DispositivosPage from "../pages/dashboard/DispositivosPage";
import OrdenesPage from "../pages/dashboard/OrdenesPage";
import ReparacionesPage from "../pages/dashboard/ReparacionesPage";
import UsuariosPage from "../pages/dashboard/UsuariosPage";
import HistorialPage from "../pages/dashboard/HistorialPage";
import ReportesPage from "../pages/dashboard/ReportesPage";
import ConfiguracionPage from "../pages/dashboard/ConfiguracionPage";
import { RESOURCES } from "../utils/permissions";

/**
 * Nuevo Router con arquitectura de permisos granulares
 * Incluye protección de rutas y Context de autenticación
 */
function NewAppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública de Login */}
          <Route path="/login" element={<NewLoginPage />} />

          {/* Ruta de acceso denegado */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* RUTA PÚBLICA DE TRACKING - Sin autenticación */}
          <Route path="/tracking/:ordenId" element={<TrackingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/consulta/:ordenId" element={<TrackingPage />} />
          <Route path="/consulta" element={<TrackingPage />} />

          {/* Rutas protegidas con MainLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <NewMainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard principal - Todos los roles */}
            <Route
              index
              element={
                <ProtectedRoute resource={RESOURCES.DASHBOARD}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Usuarios - Solo Admin */}
            <Route
              path="usuarios"
              element={
                <ProtectedRoute resource={RESOURCES.USUARIOS}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />

            {/* Clientes - Admin y Recepcionista */}
            <Route
              path="clientes"
              element={
                <ProtectedRoute resource={RESOURCES.CLIENTES}>
                  <ClientesPage />
                </ProtectedRoute>
              }
            />

            {/* Dispositivos - Admin, Recepcionista y Técnico */}
            <Route
              path="dispositivos"
              element={
                <ProtectedRoute resource={RESOURCES.DISPOSITIVOS}>
                  <DispositivosPage />
                </ProtectedRoute>
              }
            />

            {/* Órdenes - Todos los roles (con diferentes permisos) */}
            <Route
              path="ordenes"
              element={
                <ProtectedRoute resource={RESOURCES.ORDENES}>
                  <OrdenesPage />
                </ProtectedRoute>
              }
            />

            {/* Reparaciones - Admin y Técnico */}
            <Route
              path="reparaciones"
              element={
                <ProtectedRoute resource={RESOURCES.REPARACIONES}>
                  <ReparacionesPage />
                </ProtectedRoute>
              }
            />

            {/* Historial - Todos los roles */}
            <Route
              path="historial"
              element={
                <ProtectedRoute resource={RESOURCES.HISTORIAL}>
                  <HistorialPage />
                </ProtectedRoute>
              }
            />

            {/* Reportes - Solo Admin */}
            <Route
              path="reportes"
              element={
                <ProtectedRoute resource={RESOURCES.REPORTES}>
                  <ReportesPage />
                </ProtectedRoute>
              }
            />

            {/* Configuración - Solo Admin */}
            <Route
              path="configuracion"
              element={
                <ProtectedRoute resource={RESOURCES.CONFIGURACION}>
                  <ConfiguracionPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rutas antiguas (compatibilidad temporal) */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/recepcion" element={<Navigate to="/dashboard" replace />} />
          <Route path="/tecnico" element={<Navigate to="/dashboard" replace />} />

          {/* Redirigir a dashboard por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default NewAppRouter;
