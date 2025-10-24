// src/hooks/useToast.js
import { useState } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "info", message, duration = 3000 }) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) => {
    addToast({ type: "success", message, duration });
  };

  const error = (message, duration) => {
    addToast({ type: "error", message, duration });
  };

  const warning = (message, duration) => {
    addToast({ type: "warning", message, duration });
  };

  const info = (message, duration) => {
    addToast({ type: "info", message, duration });
  };

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}