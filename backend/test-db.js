const pool = require('./db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('⏰ Hora en servidor PostgreSQL:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Error en consulta:', err);
  } finally {
    pool.end();
  }
})();
