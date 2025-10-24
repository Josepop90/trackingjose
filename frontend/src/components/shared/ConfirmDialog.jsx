// src/components/shared/ConfirmDialog.jsx
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import Modal from "./Modal";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          bg: "bg-red-100",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          bg: "bg-yellow-100",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "info":
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          bg: "bg-blue-100",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          bg: "bg-red-100",
          button: "bg-red-600 hover:bg-red-700",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className={`${config.bg} rounded-lg p-4 flex items-start gap-3`}>
          {config.icon}
          <p className="text-sm text-gray-700">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${config.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;