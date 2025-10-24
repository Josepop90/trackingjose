// src/hooks/useConfirm.js
import { useState } from "react";

export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: () => {},
  });

  const confirm = ({
    title,
    message,
    type = "danger",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        cancelText,
        onConfirm: () => {
          resolve(true);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmState,
    confirm,
    closeConfirm,
  };
}