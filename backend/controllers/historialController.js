// backend/controllers/historialController.js
const Historial = require("../models/historialModel");

// Listar todo el historial
const listarTodoHistorial = async (req, res) => {
  try {
    const data = await Historial.getHistorial();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
};

// Listar historial por orden
const listarHistorial = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const data = await Historial.getHistorialByOrden(ordenId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial de la orden" });
  }
};

// Crear entrada en historial
const crearHistorial = async (req, res) => {
  try {
    const nuevo = await Historial.createHistorial(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar historial" });
  }
};

module.exports = { listarTodoHistorial, listarHistorial, crearHistorial };
