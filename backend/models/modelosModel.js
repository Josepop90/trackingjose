const pool = require("../db");

// Obtener todos los modelos con nombre de marca
const getModelos = async () => {
  const result = await pool.query(`
    SELECT m.*, ma.nombre as marca_nombre
    FROM modelos m
    LEFT JOIN marcas ma ON m.marca_id = ma.id
    ORDER BY m.nombre ASC
  `);
  return result.rows;
};

// Obtener modelos por marca
const getModelosByMarca = async (marcaId) => {
  const result = await pool.query(
    "SELECT * FROM modelos WHERE marca_id = $1 ORDER BY nombre ASC",
    [marcaId]
  );
  return result.rows;
};

// Crear un modelo
const createModelo = async (data) => {
  const { nombre, marca_id } = data;
  const result = await pool.query(
    "INSERT INTO modelos (nombre, marca_id) VALUES ($1, $2) RETURNING *",
    [nombre, marca_id]
  );
  return result.rows[0];
};

// Actualizar un modelo
const updateModelo = async (id, data) => {
  const { nombre, marca_id } = data;
  const result = await pool.query(
    "UPDATE modelos SET nombre = $1, marca_id = $2 WHERE id = $3 RETURNING *",
    [nombre, marca_id, id]
  );
  return result.rows[0];
};

// Eliminar un modelo
const deleteModelo = async (id) => {
  const result = await pool.query(
    "DELETE FROM modelos WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getModelos,
  getModelosByMarca,
  createModelo,
  updateModelo,
  deleteModelo
};
