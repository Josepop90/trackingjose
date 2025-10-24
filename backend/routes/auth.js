// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

// Iniciar sesión
router.post("/login", ctrl.login);

// Registrar nuevo usuario (solo admins)
router.post("/register", ctrl.registrar);

module.exports = router;
