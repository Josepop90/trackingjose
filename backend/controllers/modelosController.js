const Modelo = require("../models/modelosModel");

const listarModelos = async (req, res) => {
  try {
    const modelos = await Modelo.getModelos();
    res.json(modelos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener modelos" });
  }
};

const listarModelosPorMarca = async (req, res) => {
  try {
    const { marcaId } = req.params;
    const modelos = await Modelo.getModelosByMarca(marcaId);
    res.json(modelos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener modelos" });
  }
};

const crearModelo = async (req, res) => {
  try {
    const { nombre, marca_id } = req.body;

    if (!nombre || !marca_id) {
      return res.status(400).json({ error: "El nombre y marca_id son requeridos" });
    }

    const nuevoModelo = await Modelo.createModelo({ nombre, marca_id });
    res.status(201).json(nuevoModelo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear modelo" });
  }
};

const actualizarModelo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, marca_id } = req.body;

    if (!nombre || !marca_id) {
      return res.status(400).json({ error: "El nombre y marca_id son requeridos" });
    }

    const modeloActualizado = await Modelo.updateModelo(id, { nombre, marca_id });

    if (!modeloActualizado) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    res.json(modeloActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar modelo" });
  }
};

const eliminarModelo = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Modelo.deleteModelo(id);

    if (!resultado) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    res.json({ message: "Modelo eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar modelo" });
  }
};

module.exports = {
  listarModelos,
  listarModelosPorMarca,
  crearModelo,
  actualizarModelo,
  eliminarModelo
};
