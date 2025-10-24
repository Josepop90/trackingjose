const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/marcasController");
const verificarToken = require("../middleware/authMiddleware");

// Listar todas las marcas (cualquier usuario autenticado)
router.get("/", verificarToken, ctrl.listarMarcas);

// Crear una marca (solo admin)
router.post("/", verificarToken, ctrl.crearMarca);

// Actualizar una marca (solo admin)
router.patch("/:id", verificarToken, ctrl.actualizarMarca);

// Eliminar una marca (solo admin)
router.delete("/:id", verificarToken, ctrl.eliminarMarca);

module.exports = router;
