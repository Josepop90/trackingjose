// backend/models/usuariosModel.js
const pool = require("../db");
const bcrypt = require("bcrypt");

// Listar todos los usuarios con su rol
const getUsuarios = async () => {
  const { rows } = await pool.query(`
    SELECT u.*, r.nombre AS rol_nombre
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
    ORDER BY u.creado_en DESC
  `);
  return rows;
};

// Obtener usuario por ID
const getUsuarioById = async (id) => {
  const { rows } = await pool.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
};

// Crear nuevo usuario
const createUsuario = async ({
  nombre_completo,
  correo,
  telefono,
  rol_id,
  activo,
  password,
}) => {
  // Encriptar contraseña si se proporciona
  const password_hash = password ? await bcrypt.hash(password, 10) : null;

  const { rows } = await pool.query(
    `INSERT INTO usuarios
      (nombre_completo, correo, telefono, rol_id, activo, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre_completo, correo, telefono, rol_id, activo ?? true, password_hash]
  );
  return rows[0];
};

// Actualizar usuario existente (solo campos enviados)
const updateUsuario = async (id, fields) => {
  const updates = [];
  const values = [];
  let index = 1;

  // Si viene password, encriptarla y cambiar el campo a password_hash
  if (fields.password) {
    const password_hash = await bcrypt.hash(fields.password, 10);
    delete fields.password;
    fields.password_hash = password_hash;
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updates.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (updates.length === 0) return null;

  updates.push(`actualizado_en = NOW()`);
  const query = `
    UPDATE usuarios
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;
  values.push(id);

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Eliminar usuario
const deleteUsuario = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
