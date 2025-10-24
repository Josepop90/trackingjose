// backend/routes/dispositivos.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/dispositivosController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Admin o recepcionista gestionan dispositivos
router.get("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.listarDispositivos);
router.get("/:id", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.obtenerDispositivo);
router.post("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.crearDispositivo);
router.patch("/:id", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.actualizarDispositivo);
router.delete("/:id", verificarToken, verificarRol("Administrador"), ctrl.eliminarDispositivo);

module.exports = router;
