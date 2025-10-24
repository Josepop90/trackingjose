const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/rolesController");
const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

// Listar roles (Admin y Recepcionista pueden ver para asignar)
router.get("/", verificarToken, verificarRol("Administrador", "Recepcionista"), ctrl.listarRoles);

module.exports = router;
