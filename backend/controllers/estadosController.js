// backend/controllers/estadosController.js
const Estado = require("../models/estadosModel");

// Listar todos
const listarEstados = async (_req, res) => {
  try {
    const data = await Estado.getEstados();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener estados" });
  }
};

// Obtener por ID
const obtenerEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estado = await Estado.getEstadoById(id);
    if (!estado) return res.status(404).json({ error: "Estado no encontrado" });
    res.json(estado);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener estado" });
  }
};

// Crear nuevo estado
const crearEstado = async (req, res) => {
  try {
    const nuevo = await Estado.createEstado(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: "Error al crear estado" });
  }
};

// Actualizar estado
const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Estado.updateEstado(id, req.body);
    if (!actualizado)
      return res.status(404).json({ error: "Estado no encontrado" });
    res.json(actualizado);
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};

// Eliminar estado
const eliminarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Estado.deleteEstado(id);
    if (!eliminado)
      return res.status(404).json({ error: "Estado no encontrado" });
    res.json({ mensaje: "Estado eliminado", eliminado });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar estado" });
  }
};

module.exports = {
  listarEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado,
};
