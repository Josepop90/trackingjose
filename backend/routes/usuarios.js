const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/usuariosController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Administrador y Recepcionista pueden ver usuarios (para asignar técnicos)
router.get("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.listarUsuarios);
router.get("/:id", verificarToken, verificarRol("Administrador"), ctrl.obtenerUsuario);
router.post("/", verificarToken, verificarRol("Administrador"), ctrl.crearUsuario);
router.patch("/:id", verificarToken, verificarRol("Administrador"), ctrl.actualizarUsuario);
router.delete("/:id", verificarToken, verificarRol("Administrador"), ctrl.eliminarUsuario);

module.exports = router;
