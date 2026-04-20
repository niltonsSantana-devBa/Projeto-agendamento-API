require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const porta = 3000;

app.use(express.json());


const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


conexao.connect((erro) => {
    if (erro) {
        console.error(' Erro ao conectar com o banco de dados:', erro);
        return;
    }
    console.log(' Conectado ao banco de dados MySQL com sucesso! ');
});


app.get('/', (req, res) => {
    res.send('Fala, dev! O servidor da Clínica de Arquitetura está ON e conectado ao banco! 🚀');
});


const porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log(`🌐 Servidor rodando bonitão em http://localhost:${porta}`);
});


app.get('/clientes', (req, res) => {
   
    const comandoSql = 'SELECT * FROM clientes';

    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error(' Erro ao buscar os clientes:', erro);
            res.status(500).send('Deu erro ao tentar buscar os dados.');
            return;
        }
        res.json(resultados);
    });
});