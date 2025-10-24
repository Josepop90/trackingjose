// backend/models/dispositivosModel.js
const pool = require("../db");

// Listar todos los dispositivos con nombres de marca y modelo
const getDispositivos = async () => {
  const { rows } = await pool.query(
    `SELECT
      d.*,
      c.nombre_completo as cliente_nombre,
      m.nombre as marca_nombre,
      mo.nombre as modelo_nombre
    FROM dispositivos d
    LEFT JOIN clientes c ON d.cliente_id = c.id
    LEFT JOIN marcas m ON d.marca_id = m.id
    LEFT JOIN modelos mo ON d.modelo_id = mo.id
    ORDER BY d.creado_en DESC`
  );
  return rows;
};

// Listar dispositivos por cliente
const getDispositivosByCliente = async (clienteId) => {
  const { rows } = await pool.query(
    "SELECT * FROM dispositivos WHERE cliente_id = $1 ORDER BY creado_en DESC",
    [clienteId]
  );
  return rows;
};

// Obtener un dispositivo por ID
const getDispositivoById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM dispositivos WHERE id = $1",
    [id]
  );
  return rows[0];
};

// Crear dispositivo (IMEI y número_serie opcionales)
const createDispositivo = async ({
  cliente_id,
  marca_id,
  modelo_id,
  imei,
  numero_serie,
  color,
  notas,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO dispositivos
      (cliente_id, marca_id, modelo_id, imei, numero_serie, color, notas)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      cliente_id,
      marca_id ?? null,
      modelo_id ?? null,
      imei ?? null,
      numero_serie ?? null,
      color ?? null,
      notas ?? null,
    ]
  );
  return rows[0];
};

// Actualizar dispositivo (todos opcionales salvo id)
const updateDispositivo = async (
  id,
  { marca_id, modelo_id, imei, numero_serie, color, notas }
) => {
  const { rows } = await pool.query(
    `UPDATE dispositivos
       SET marca_id = $1,
           modelo_id = $2,
           imei = $3,
           numero_serie = $4,
           color = $5,
           notas = $6,
           actualizado_en = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      marca_id ?? null,
      modelo_id ?? null,
      imei ?? null,
      numero_serie ?? null,
      color ?? null,
      notas ?? null,
      id,
    ]
  );
  return rows[0];
};

// Eliminar dispositivo
const deleteDispositivo = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM dispositivos WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

module.exports = {
  getDispositivos,
  getDispositivosByCliente,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
};
