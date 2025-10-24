import { Outlet } from "react-router-dom";
import DynamicSidebar from "./DynamicSidebar";
import Header from "./Header";

/**
 * Nuevo MainLayout que usa DynamicSidebar
 * El sidebar se adapta automáticamente según el rol del usuario
 */
function NewMainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Dinámico */}
      <DynamicSidebar />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewMainLayout;
