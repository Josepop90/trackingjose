// src/components/shared/Toast.jsx
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

function Toast({ type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-500",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: "text-green-800",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-500",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: "text-red-800",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-500",
          icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
          text: "text-yellow-800",
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-500",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          text: "text-blue-800",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-500",
          icon: <Info className="w-5 h-5 text-gray-600" />,
          text: "text-gray-800",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`${styles.bg} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-md animate-slide-in`}
    >
      {styles.icon}
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;