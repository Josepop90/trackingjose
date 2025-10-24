const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/modelosController");
const verificarToken = require("../middleware/authMiddleware");

// Listar todos los modelos (cualquier usuario autenticado)
router.get("/", verificarToken, ctrl.listarModelos);

// Listar modelos por marca
router.get("/marca/:marcaId", verificarToken, ctrl.listarModelosPorMarca);

// Crear un modelo (solo admin)
router.post("/", verificarToken, ctrl.crearModelo);

// Actualizar un modelo (solo admin)
router.patch("/:id", verificarToken, ctrl.actualizarModelo);

// Eliminar un modelo (solo admin)
router.delete("/:id", verificarToken, ctrl.eliminarModelo);

module.exports = router;
