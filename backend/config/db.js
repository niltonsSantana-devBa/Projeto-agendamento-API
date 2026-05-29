require('dotenv').config();
const mysql = require('mysql2');

// Configuração do pool de conexões com o banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Usando promises para permitir async/await
const promisePool = pool.promise();

module.exports = promisePool;
