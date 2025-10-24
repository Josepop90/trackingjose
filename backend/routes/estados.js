const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/estadosController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Solo el administrador puede modificar o eliminar
router.get("/", verificarToken, verificarRol("Administrador", "Técnico", "Recepcionista"), ctrl.listarEstados);
router.get("/:id", verificarToken, verificarRol("Administrador", "Técnico", "Recepcionista"), ctrl.obtenerEstado);
router.post("/", verificarToken, verificarRol("Administrador"), ctrl.crearEstado);
router.patch("/:id", verificarToken, verificarRol("Administrador"), ctrl.actualizarEstado);
router.delete("/:id", verificarToken, verificarRol("Administrador"), ctrl.eliminarEstado);

module.exports = router;
