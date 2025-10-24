// backend/models/ordenesModel.js

const pool = require("../db");

// Listar todas las órdenes con información completa
const getOrdenes = async () => {
  const { rows } = await pool.query(`
    SELECT
      o.*,
      c.nombre_completo as cliente_nombre,
      c.telefono as cliente_telefono,
      d.imei as dispositivo_imei,
      d.color as dispositivo_color,
      m.nombre as marca_nombre,
      mo.nombre as modelo_nombre,
      e.etiqueta_publica as estado_nombre,
      u.nombre_completo as tecnico_nombre
    FROM ordenes o
    LEFT JOIN clientes c ON o.cliente_id = c.id
    LEFT JOIN dispositivos d ON o.dispositivo_id = d.id
    LEFT JOIN marcas m ON d.marca_id = m.id
    LEFT JOIN modelos mo ON d.modelo_id = mo.id
    LEFT JOIN catalogo_estados e ON o.estado_actual_id = e.id
    LEFT JOIN usuarios u ON o.tecnico_asignado = u.id
    ORDER BY o.creado_en DESC
  `);
  return rows;
};

// Obtener orden por ID
const getOrdenById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM ordenes WHERE id = $1", [id]);
  return rows[0];
};

// Obtener órdenes de un cliente
const getOrdenesByCliente = async (clienteId) => {
  const { rows } = await pool.query(
    "SELECT * FROM ordenes WHERE cliente_id = $1 ORDER BY creado_en DESC",
    [clienteId]
  );
  return rows;
};

// Crear orden y registrar historial inicial
const createOrden = async ({
  cliente_id,
  dispositivo_id,
  descripcion_problema,
  tecnico_asignado,
  estado_actual_id,
  prioridad,
  fecha_entrega_estimada,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const ordenResult = await client.query(
      `INSERT INTO ordenes 
        (cliente_id, dispositivo_id, descripcion_problema, tecnico_asignado, estado_actual_id, prioridad, fecha_entrega_estimada) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING *`,
      [
        cliente_id,
        dispositivo_id,
        descripcion_problema,
        tecnico_asignado ?? null,
        estado_actual_id ?? 1,
        prioridad ?? "normal",
        fecha_entrega_estimada ?? null,
      ]
    );

    const nuevaOrden = ordenResult.rows[0];

    await client.query(
      `INSERT INTO historial_estados 
        (orden_id, estado_origen, estado_destino, nota, cambiado_por) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        nuevaOrden.id,
        null,
        nuevaOrden.estado_actual_id,
        "Orden creada con estado inicial",
        tecnico_asignado ?? null,
      ]
    );

    await client.query("COMMIT");
    return nuevaOrden;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Actualizar orden y registrar en historial
const updateOrden = async (id, fields) => {
  const prevQuery = await pool.query("SELECT estado_actual_id FROM ordenes WHERE id = $1", [id]);
  const estadoAnterior = prevQuery.rows[0]?.estado_actual_id ?? null;

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

  updates.push(`actualizado_en = NOW()`);
  const query = `
    UPDATE ordenes
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;
  values.push(id);

  const { rows } = await pool.query(query, values);
  const updated = rows[0];
  if (!updated) return null;

  if (fields.estado_actual_id !== undefined) {
    await pool.query(
      `INSERT INTO historial_estados 
        (orden_id, estado_origen, estado_destino, nota, cambiado_por) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        estadoAnterior,
        updated.estado_actual_id,
        "Cambio automático desde actualización de orden",
        updated.tecnico_asignado ?? null,
      ]
    );
  }

  return updated;
};

// Eliminar orden
const deleteOrden = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM ordenes WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

// Obtener detalle completo de una orden (SIN diagnostico ni solucion)
const getOrdenDetalle = async (id) => {
  const query = `
    SELECT 
      o.id,
      o.descripcion_problema,
      o.prioridad,
      o.fecha_entrega_estimada,
      o.cerrada_en,
      o.creado_en,
      o.actualizado_en,
      
      -- Información del cliente
      json_build_object(
        'id', c.id,
        'nombre_completo', c.nombre_completo,
        'telefono', c.telefono,
        'correo', c.correo
      ) AS cliente,

      -- Información del dispositivo con marca y modelo
      json_build_object(
        'id', d.id,
        'imei', d.imei,
        'color', d.color,
        'notas', d.notas,
        'marca_nombre', m.nombre,
        'modelo_nombre', mo.nombre
      ) AS dispositivo,

      -- Estado actual
      json_build_object(
        'id', e.id,
        'etiqueta_publica', e.etiqueta_publica,
        'etiqueta_interna', e.etiqueta_interna
      ) AS estado,

      -- Técnico asignado
      json_build_object(
        'id', u.id,
        'nombre_completo', u.nombre_completo,
        'correo', u.correo
      ) AS tecnico,

      -- Historial de estados
      COALESCE(
        json_agg(
          json_build_object(
            'id', h.id,
            'estado_origen', h.estado_origen,
            'estado_destino', h.estado_destino,
            'nota', h.nota,
            'cambiado_por', h.cambiado_por,
            'creado_en', h.creado_en,
            'estado_origen_nombre', co.etiqueta_publica,
            'estado_destino_nombre', cd.etiqueta_publica
          )
          ORDER BY h.creado_en ASC
        ) FILTER (WHERE h.id IS NOT NULL),
        '[]'
      ) AS historial

    FROM ordenes o
    LEFT JOIN clientes c ON o.cliente_id = c.id
    LEFT JOIN dispositivos d ON o.dispositivo_id = d.id
    LEFT JOIN marcas m ON d.marca_id = m.id
    LEFT JOIN modelos mo ON d.modelo_id = mo.id
    LEFT JOIN catalogo_estados e ON o.estado_actual_id = e.id
    LEFT JOIN usuarios u ON o.tecnico_asignado = u.id
    LEFT JOIN historial_estados h ON h.orden_id = o.id
    LEFT JOIN catalogo_estados co ON co.id = h.estado_origen
    LEFT JOIN catalogo_estados cd ON cd.id = h.estado_destino
    WHERE o.id = $1
    GROUP BY o.id, c.id, d.id, m.id, mo.id, e.id, u.id;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  getOrdenes,
  getOrdenById,
  getOrdenesByCliente,
  createOrden,
  updateOrden,
  deleteOrden,
  getOrdenDetalle,
};