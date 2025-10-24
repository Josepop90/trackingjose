const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clientesController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Solo administradores y recepcionistas pueden gestionar clientes
router.get("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.listarClientes);
router.get("/:id", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.obtenerCliente);
router.post("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.crearCliente);
router.patch("/:id", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.actualizarCliente);
router.delete("/:id", verificarToken, verificarRol("Administrador"), ctrl.eliminarCliente);

module.exports = router;
