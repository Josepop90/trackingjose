const pool = require("../db");

// Listar todos los estados
const getEstados = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM catalogo_estados ORDER BY orden ASC"
  );
  return rows;
};

// Obtener estado por ID
const getEstadoById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM catalogo_estados WHERE id = $1",
    [id]
  );
  return rows[0];
};

// Crear nuevo estado
const createEstado = async (data) => {
  const {
    codigo,
    etiqueta_publica,
    etiqueta_interna,
    mensaje_publico,
    orden,
    es_terminal,
    visible_cliente,
  } = data;

  // Validaciones mínimas
  if (!codigo || !etiqueta_publica || !etiqueta_interna) {
    throw new Error("Campos requeridos faltantes");
  }

  const { rows } = await pool.query(
    `INSERT INTO catalogo_estados 
      (codigo, etiqueta_publica, etiqueta_interna, mensaje_publico, orden, es_terminal, visible_cliente)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      codigo,
      etiqueta_publica,
      etiqueta_interna,
      mensaje_publico ?? null,
      orden ?? 1,               // por defecto prioridad baja
      es_terminal ?? false,     // boolean seguro
      visible_cliente ?? true,  // visible por defecto
    ]
  );

  return rows[0];
};

// Actualizar estado existente
const updateEstado = async (id, fields) => {
  const updates = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updates.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (updates.length === 0) return null;

  const query = `
    UPDATE catalogo_estados
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;

  values.push(id);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Eliminar estado
const deleteEstado = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM catalogo_estados WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

module.exports = {
  getEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado,
};
