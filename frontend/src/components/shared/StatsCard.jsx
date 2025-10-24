/**
 * Componente reutilizable para mostrar tarjetas de estadísticas
 * Usado en todos los dashboards (Admin, Recepción, Técnico)
 */
function StatsCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      cyan: "bg-cyan-50 text-cyan-600",
      green: "bg-green-50 text-green-600",
      amber: "bg-amber-50 text-amber-600",
      orange: "bg-orange-50 text-orange-600",
      red: "bg-red-50 text-red-600",
      purple: "bg-purple-50 text-purple-600",
      pink: "bg-pink-50 text-pink-600",
      indigo: "bg-indigo-50 text-indigo-600",
      teal: "bg-teal-50 text-teal-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
