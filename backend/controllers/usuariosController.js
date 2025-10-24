// backend/controllers/usuariosController.js
const Usuario = require("../models/usuariosModel");

// Listar todos
const listarUsuarios = async (_req, res) => {
  try {
    const data = await Usuario.getUsuarios();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener por ID
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.getUsuarioById(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Crear nuevo
const crearUsuario = async (req, res) => {
  try {
    const nuevo = await Usuario.createUsuario(req.body);
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Actualizar existente
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Usuario.updateUsuario(id, req.body);
    if (!actualizado)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.deleteUsuario(id);
    if (!eliminado)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado", eliminado });
  } catch {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
