// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Auth = require("../models/authModel");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "supersecreto123"; // ideal: usar variable .env

// 🔹 LOGIN (autenticación)
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password)
      return res.status(400).json({ error: "Correo y contraseña son requeridos" });

    const usuario = await Auth.getUsuarioByCorreo(correo);
    if (!usuario)
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });

    // Validar roles permitidos
    const rolesPermitidos = ["Administrador", "Recepcionista", "Técnico"];
    if (!rolesPermitidos.includes(usuario.rol_nombre))
      return res.status(403).json({ error: "No tiene permiso para iniciar sesión" });

    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol_nombre },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        rol: usuario.rol_nombre,
        correo: usuario.correo,
      },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// 🔹 REGISTRO (solo administradores pueden crear otros usuarios)
const registrar = async (req, res) => {
  try {
    const nuevo = await Auth.createUsuario(req.body);
    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevo,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

module.exports = {
  login,
  registrar,
};
