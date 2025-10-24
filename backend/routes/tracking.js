const express = require("express");
const router = express.Router();
const pool = require("../db");

// Endpoint PÚBLICO - No requiere autenticación
router.get("/:ordenId", async (req, res) => {
  try {
    const { ordenId } = req.params;

    // Obtener información de la orden (solo datos públicos)
    const ordenQuery = await pool.query(
      `SELECT
        o.id,
        o.creado_en,
        o.prioridad,
        c.nombre_completo as cliente_nombre,
        m.nombre as marca_nombre,
        mo.nombre as modelo_nombre,
        e.etiqueta_publica as estado_nombre
       FROM ordenes o
       LEFT JOIN clientes c ON o.cliente_id = c.id
       LEFT JOIN dispositivos d ON o.dispositivo_id = d.id
       LEFT JOIN marcas m ON d.marca_id = m.id
       LEFT JOIN modelos mo ON d.modelo_id = mo.id
       LEFT JOIN catalogo_estados e ON o.estado_actual_id = e.id
       WHERE o.id = $1`,
      [ordenId]
    );

    if (ordenQuery.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Obtener historial de cambios (solo información pública)
    const historialQuery = await pool.query(
      `SELECT
        h.id,
        h.creado_en,
        h.nota,
        ed.etiqueta_publica as estado_destino_nombre
       FROM historial_estados h
       LEFT JOIN catalogo_estados ed ON h.estado_destino = ed.id
       WHERE h.orden_id = $1
       ORDER BY h.creado_en ASC`,
      [ordenId]
    );

    res.json({
      orden: ordenQuery.rows[0],
      historial: historialQuery.rows,
    });
  } catch (error) {
    console.error("Error en tracking:", error);
    res.status(500).json({ error: "Error al consultar el tracking" });
  }
});

module.exports = router;
