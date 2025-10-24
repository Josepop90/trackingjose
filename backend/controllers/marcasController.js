const Marca = require("../models/marcasModel");

const listarMarcas = async (req, res) => {
  try {
    const marcas = await Marca.getMarcas();
    res.json(marcas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
};

const crearMarca = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevaMarca = await Marca.createMarca({ nombre });
    res.status(201).json(nuevaMarca);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear marca" });
  }
};

const actualizarMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const marcaActualizada = await Marca.updateMarca(id, { nombre });

    if (!marcaActualizada) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    res.json(marcaActualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar marca" });
  }
};

const eliminarMarca = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await Marca.deleteMarca(id);

    if (!resultado) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    res.json({ message: "Marca eliminada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar marca" });
  }
};

module.exports = {
  listarMarcas,
  crearMarca,
  actualizarMarca,
  eliminarMarca
};
