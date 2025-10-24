const pool = require("../db");

// Obtener todos los clientes
const getClientes = async () => {
  const result = await pool.query("SELECT * FROM clientes ORDER BY creado_en DESC");
  return result.rows;
};

// Obtener cliente por ID
const getClienteById = async (id) => {
  const result = await pool.query("SELECT * FROM clientes WHERE id = $1", [id]);
  return result.rows[0];
};

// Crear cliente
const createCliente = async ({ nombre_completo, telefono, correo, documento_id, direccion }) => {
  const result = await pool.query(
    `INSERT INTO clientes (nombre_completo, telefono, correo, documento_id, direccion) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre_completo, telefono, correo, documento_id || null, direccion || null]
  );
  return result.rows[0];
};

// Actualizar cliente
const updateCliente = async (id, { nombre_completo, telefono, correo, documento_id, direccion }) => {
  const result = await pool.query(
    `UPDATE clientes 
     SET nombre_completo = $1, telefono = $2, correo = $3, documento_id = $4, direccion = $5, actualizado_en = NOW()
     WHERE id = $6 RETURNING *`,
    [nombre_completo, telefono, correo, documento_id || null, direccion || null, id]
  );
  return result.rows[0];
};

// Eliminar cliente
const deleteCliente = async (id) => {
  const result = await pool.query("DELETE FROM clientes WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = { getClientes, getClienteById, createCliente, updateCliente, deleteCliente };
