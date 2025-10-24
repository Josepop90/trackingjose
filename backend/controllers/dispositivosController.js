// backend/controllers/dispositivosController.js
const pool = require("../db");
const Dispositivo = require("../models/dispositivosModel");

// Validador simple de UUID v4 (aceptable para nuestro caso)
const isUUID = (v) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v || ""
  );

const listarDispositivos = async (_req, res) => {
  try {
    const data = await Dispositivo.getDispositivos();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener dispositivos" });
  }
};

const listarDispositivosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    if (!isUUID(clienteId)) {
      return res.status(400).json({ error: "cliente_id inválido" });
    }
    const data = await Dispositivo.getDispositivosByCliente(clienteId);
    res.json(data);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "Error al obtener dispositivos del cliente" });
  }
};

const obtenerDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: "id inválido" });

    const item = await Dispositivo.getDispositivoById(id);
    if (!item) return res.status(404).json({ error: "Dispositivo no encontrado" });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener dispositivo" });
  }
};

const crearDispositivo = async (req, res) => {
  try {
    const { cliente_id } = req.body;

    // Validar que venga cliente_id y sea UUID
    if (!cliente_id || !isUUID(cliente_id)) {
      return res
        .status(400)
        .json({ error: "cliente_id es requerido y debe ser UUID válido" });
    }

    // Verificar que el cliente exista (evita error de FK y da msg claro)
    const check = await pool.query(
      "SELECT 1 FROM clientes WHERE id = $1 LIMIT 1",
      [cliente_id]
    );
    if (check.rowCount === 0) {
      return res.status(400).json({ error: "El cliente no existe" });
    }

    const nuevo = await Dispositivo.createDispositivo(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al crear dispositivo" });
  }
};

const actualizarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: "id inválido" });

    const actualizado = await Dispositivo.updateDispositivo(id, req.body);
    if (!actualizado)
      return res.status(404).json({ error: "Dispositivo no encontrado" });

    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar dispositivo" });
  }
};

const eliminarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: "id inválido" });

    const eliminado = await Dispositivo.deleteDispositivo(id);
    if (!eliminado)
      return res.status(404).json({ error: "Dispositivo no encontrado" });

    res.json({ mensaje: "Dispositivo eliminado", eliminado });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar dispositivo" });
  }
};

module.exports = {
  listarDispositivos,
  listarDispositivosPorCliente,
  obtenerDispositivo,
  crearDispositivo,
  actualizarDispositivo,
  eliminarDispositivo,
};
