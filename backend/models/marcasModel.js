const pool = require("../db");

// Obtener todas las marcas
const getMarcas = async () => {
  const result = await pool.query("SELECT * FROM marcas ORDER BY nombre ASC");
  return result.rows;
};

// Crear una marca
const createMarca = async (data) => {
  const { nombre } = data;
  const result = await pool.query(
    "INSERT INTO marcas (nombre) VALUES ($1) RETURNING *",
    [nombre]
  );
  return result.rows[0];
};

// Actualizar una marca
const updateMarca = async (id, data) => {
  const { nombre } = data;
  const result = await pool.query(
    "UPDATE marcas SET nombre = $1 WHERE id = $2 RETURNING *",
    [nombre, id]
  );
  return result.rows[0];
};

// Eliminar una marca
const deleteMarca = async (id) => {
  const result = await pool.query(
    "DELETE FROM marcas WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca
};
