// backend/models/historialModel.js
const pool = require("../db");

// Obtener todo el historial con información de órdenes y clientes
const getHistorial = async () => {
  const { rows } = await pool.query(
    `SELECT
      h.id,
      h.orden_id,
      h.estado_origen,
      h.estado_destino,
      h.nota,
      h.cambiado_por,
      h.creado_en,
      eo.etiqueta_publica AS estado_origen_nombre,
      ed.etiqueta_publica AS estado_destino_nombre,
      u.nombre_completo AS tecnico_nombre,
      o.descripcion_problema,
      c.nombre_completo AS cliente_nombre,
      d.imei AS dispositivo_imei,
      m.nombre AS marca_nombre,
      mo.nombre AS modelo_nombre
     FROM historial_estados h
     LEFT JOIN catalogo_estados eo ON h.estado_origen = eo.id
     LEFT JOIN catalogo_estados ed ON h.estado_destino = ed.id
     LEFT JOIN usuarios u ON h.cambiado_por = u.id
     LEFT JOIN ordenes o ON h.orden_id = o.id
     LEFT JOIN clientes c ON o.cliente_id = c.id
     LEFT JOIN dispositivos d ON o.dispositivo_id = d.id
     LEFT JOIN marcas m ON d.marca_id = m.id
     LEFT JOIN modelos mo ON d.modelo_id = mo.id
     ORDER BY h.creado_en DESC`
  );
  return rows;
};

// Obtener historial por orden
const getHistorialByOrden = async (ordenId) => {
  const { rows } = await pool.query(
    `SELECT h.id, h.orden_id, h.estado_origen, h.estado_destino, h.nota, h.cambiado_por, h.creado_en,
            eo.etiqueta_interna AS estado_origen_nombre,
            ed.etiqueta_interna AS estado_destino_nombre,
            u.nombre_completo AS tecnico
     FROM historial_estados h
     LEFT JOIN catalogo_estados eo ON h.estado_origen = eo.id
     LEFT JOIN catalogo_estados ed ON h.estado_destino = ed.id
     LEFT JOIN usuarios u ON h.cambiado_por = u.id
     WHERE h.orden_id = $1
     ORDER BY h.creado_en ASC`,
    [ordenId]
  );
  return rows;
};

// Registrar nuevo cambio de estado
const createHistorial = async ({ orden_id, estado_origen, estado_destino, nota, cambiado_por }) => {
  const { rows } = await pool.query(
    `INSERT INTO historial_estados (orden_id, estado_origen, estado_destino, nota, cambiado_por)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [orden_id, estado_origen ?? null, estado_destino, nota ?? null, cambiado_por ?? null]
  );
  return rows[0];
};

module.exports = { getHistorial, getHistorialByOrden, createHistorial };
