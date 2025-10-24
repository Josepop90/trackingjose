// backend/models/authModel.js
const pool = require("../db");
const bcrypt = require("bcrypt");

// Buscar usuario por correo
const getUsuarioByCorreo = async (correo) => {
  const { rows } = await pool.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     JOIN roles r ON u.rol_id = r.id
     WHERE u.correo = $1 AND u.activo = true`,
    [correo]
  );
  return rows[0];
};

// Crear nuevo usuario con contraseña encriptada
const createUsuario = async ({ nombre_completo, correo, telefono, rol_id, password }) => {
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre_completo, correo, telefono, rol_id, activo, password_hash)
     VALUES ($1, $2, $3, $4, true, $5)
     RETURNING id, nombre_completo, correo, rol_id`,
    [nombre_completo, correo, telefono, rol_id, password_hash]
  );
  return rows[0];
};

module.exports = {
  getUsuarioByCorreo,
  createUsuario,
};
