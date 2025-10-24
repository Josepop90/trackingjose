const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/historialController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Listar todo el historial (todos los roles pueden ver)
router.get("/", verificarToken, ctrl.listarTodoHistorial);

// Historial por orden (admin o técnico)
router.get("/orden/:ordenId", verificarToken, verificarRol("Administrador", "Técnico"), ctrl.listarHistorial);

// Registrar nuevo movimiento (técnico o admin)
router.post("/", verificarToken, verificarRol("Administrador", "Técnico"), ctrl.crearHistorial);

module.exports = router;
