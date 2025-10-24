// backend/controllers/rolesController.js
const Rol = require("../models/rolesModel");

// Listar todos los roles
const listarRoles = async (_req, res) => {
  try {
    const data = await Rol.getRoles();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener roles" });
  }
};

module.exports = {
  listarRoles,
};
