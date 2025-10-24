// backend/routes/ordenes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ordenesController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Ruta pública de tracking (sin autenticación)
// Debe ir antes de todas las rutas protegidas
router.get("/tracking/:id", ctrl.obtenerTracking);

// Rutas protegidas de órdenes
// Listar todas las órdenes (Administrador, Recepcionista, Técnico)
router.get(
  "/",
  verificarToken,
  verificarRol("Administrador", "Recepcionista", "Técnico"),
  ctrl.listarOrdenes
);

// Obtener detalle completo de una orden (Administrador, Recepcionista, Técnico)
router.get(
  "/:id/detalle",
  verificarToken,
  verificarRol("Administrador", "Recepcionista", "Técnico"),
  ctrl.obtenerOrdenDetalle
);

// Obtener una orden por ID (Administrador, Recepcionista, Técnico)
router.get(
  "/:id",
  verificarToken,
  verificarRol("Administrador", "Recepcionista", "Técnico"),
  ctrl.obtenerOrden
);

// Crear nueva orden (solo Recepcionista o Administrador)
router.post(
  "/",
  verificarToken,
  verificarRol("Administrador", "Recepcionista"),
  ctrl.crearOrden
);

// Actualizar orden (Técnico, Administrador y Recepcionista)
router.patch(
  "/:id",
  verificarToken,
  verificarRol("Administrador", "Recepcionista", "Técnico"),
  ctrl.actualizarOrden
);

// Eliminar orden (solo Administrador)
router.delete(
  "/:id",
  verificarToken,
  verificarRol("Administrador"),
  ctrl.eliminarOrden
);

module.exports = router;