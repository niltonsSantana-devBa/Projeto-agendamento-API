require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuração do Sequelize com o banco de dados
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Desabilita log de queries no console
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Testar a conexão
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso usando Sequelize.');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

module.exports = sequelize;
