const Cliente = require("../models/clientesModel");

// Listar todos los clientes
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getClientes();
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// Obtener cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.getClienteById(id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

// Crear nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const nuevo = await Cliente.createCliente(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// Actualizar cliente existente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Cliente.updateCliente(id, req.body);
    if (!actualizado) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Cliente.deleteCliente(id);
    if (!eliminado) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ mensaje: "Cliente eliminado", eliminado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = { listarClientes, obtenerCliente, crearCliente, actualizarCliente, eliminarCliente };
