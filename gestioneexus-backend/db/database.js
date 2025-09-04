const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT, // Asegúrate de que el puerto esté aquí
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // ESTA ES LA PARTE CRUCIAL QUE FALTA
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../certs/ca-certificate.crt'))
    }
});

module.exports = pool;