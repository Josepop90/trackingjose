// backend/controllers/ordenesController.js
const Orden = require("../models/ordenesModel");
const pool = require("../db");

// Listar todas las órdenes
const listarOrdenes = async (_req, res) => {
  try {
    const data = await Orden.getOrdenes();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

// Obtener una orden por ID
const obtenerOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.getOrdenById(id);
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(orden);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener orden" });
  }
};

// Obtener órdenes por cliente
const listarOrdenesCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const data = await Orden.getOrdenesByCliente(clienteId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener órdenes del cliente" });
  }
};

// Crear una nueva orden (con historial inicial)
const crearOrden = async (req, res) => {
  try {
    const nueva = await Orden.createOrden(req.body);

    // Consultar historial inicial
    const { rows: historial } = await pool.query(
      `SELECT h.id, h.estado_origen, h.estado_destino, h.nota, h.creado_en,
              ce_origen.etiqueta_publica AS estado_origen_nombre,
              ce_destino.etiqueta_publica AS estado_destino_nombre
       FROM historial_estados h
       LEFT JOIN catalogo_estados ce_origen ON ce_origen.id = h.estado_origen
       LEFT JOIN catalogo_estados ce_destino ON ce_destino.id = h.estado_destino
       WHERE h.orden_id = $1
       ORDER BY h.creado_en ASC`,
      [nueva.id]
    );

    res.status(201).json({
      orden: nueva,
      historial,
    });
  } catch (e) {
    res.status(500).json({ error: "Error al crear orden" });
  }
};

// Actualizar una orden y registrar historial si cambia el estado
const actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizada = await Orden.updateOrden(id, req.body);
    if (!actualizada) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(actualizada);
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar orden" });
  }
};

// Eliminar una orden
const eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Orden.deleteOrden(id);
    if (!eliminada) return res.status(404).json({ error: "Orden no encontrada" });
    res.json({ mensaje: "Orden eliminada", eliminada });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar orden" });
  }
};

// Obtener detalle completo de una orden (cliente, dispositivo e historial)
const obtenerOrdenDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Orden.getOrdenDetalle(id);
    if (!detalle) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(detalle);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener detalle de la orden" });
  }
};

//TRACKING PÚBLICO (sin autenticación)
const obtenerTracking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar orden por ID
    const detalle = await Orden.getOrdenDetalle(id);
    
    if (!detalle) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Formatear respuesta para el tracking público
    const response = {
      orden: {
        id: detalle.id,
        estado_nombre: detalle.estado?.etiqueta_publica || "Sin estado",
        estado_actual_id: detalle.estado?.id || null,
        cliente_nombre: detalle.cliente?.nombre_completo || "N/A",
        marca_nombre: detalle.dispositivo?.marca_nombre || "N/A",
        modelo_nombre: detalle.dispositivo?.modelo_nombre || "N/A",
        color: detalle.dispositivo?.color || null,
        creado_en: detalle.creado_en,
        prioridad: detalle.prioridad || "normal",
        fecha_entrega_estimada: detalle.fecha_entrega_estimada || null,
        descripcion_problema: detalle.descripcion_problema || null,
        // AGREGAR TÉCNICO - probar múltiples posibles nombres de campo
        tecnico_nombre: detalle.tecnico?.nombre_completo || 
                       detalle.tecnico_asignado?.nombre_completo || 
                       detalle.tecnico_nombre || 
                       detalle.nombre_tecnico ||
                       null,
      },
      historial: detalle.historial || [],
    };

    res.json(response);
  } catch (e) {
    console.error("Error en tracking:", e);
    res.status(500).json({ error: "Error al obtener información de tracking" });
  }
};

module.exports = {
  listarOrdenes,
  obtenerOrden,
  listarOrdenesCliente,
  crearOrden,
  actualizarOrden,
  eliminarOrden,
  obtenerOrdenDetalle,
  obtenerTracking, 
};