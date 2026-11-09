const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un "pool" de conexiones (más eficiente que abrir y cerrar una sola conexión)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probamos la conexión al iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Conectado a la base de datos MySQL:', process.env.DB_NAME);
  } catch (err) {
    console.error('Error de conexión a MySQL:', err.message);
  }
})();

module.exports = pool;