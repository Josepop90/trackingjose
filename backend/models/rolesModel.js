// backend/models/rolesModel.js
const pool = require("../db");

// Listar todos los roles
const getRoles = async () => {
  const { rows } = await pool.query(`
    SELECT * FROM roles ORDER BY id ASC
  `);
  return rows;
};

module.exports = {
  getRoles,
};
