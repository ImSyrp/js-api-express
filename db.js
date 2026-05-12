require('dotenv').config();

const { Pool } = require('pg');

const conexion = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

conexion.connect()
    .then(() => {
        console.log('[SISTEMA] Conexión con PostgreSQL establecida ✅');
    })
    .catch((err) => {
        console.error('Error de conexión:', err);
    });

module.exports = conexion;