require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const porta = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Configuração da conexão com o banco de dados usando variáveis de ambiente
const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Conectar ao banco de dados
conexao.connect((erro) => {
    if (erro) {
        console.error(' Erro ao conectar com o banco de dados:', erro);
        return;
    }
    console.log(' Conectado ao banco de dados MySQL com sucesso! ');
});

// Rota inicial
app.get('/', (req, res) => {
    res.send('O servidor está ON e conectado ao banco!');
});

// --- ROTAS DO SISTEMA ---

// Listar todos os clientes
app.get('/clientes', (req, res) => {
    const comandoSql = 'SELECT * FROM clientes';
    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error(' Erro ao buscar os clientes:', erro);
            res.status(500).send('Erro ao buscar clientes.');
            return;
        }
        res.json(resultados);
    });
});

// Listar todos os profissionais (arquitetos)
app.get('/profissionais', (req, res) => {
    const comandoSql = 'SELECT * FROM profissionais';
    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error(' Erro ao buscar os profissionais:', erro);
            res.status(500).send('Erro ao buscar profissionais.');
            return;
        }
        res.json(resultados);
    });
});

// Listar todos os serviços
app.get('/servicos', (req, res) => {
    const comandoSql = 'SELECT * FROM servicos';
    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error(' Erro ao buscar os serviços:', erro);
            res.status(500).send('Erro ao buscar serviços.');
            return;
        }
        res.json(resultados);
    });
});

// Listar todos os agendamentos
app.get('/agendamentos', (req, res) => {
    const comandoSql = `
        SELECT 
            a.id, 
            c.nome AS cliente, 
            p.nome AS profissional, 
            s.nome AS servico, 
            a.data_hora, 
            a.status, 
            a.modalidade
        FROM agendamentos a
        JOIN clientes c ON a.cliente_id = c.id
        JOIN profissionais p ON a.profissional_id = p.id
        JOIN servicos s ON a.servico_id = s.id
    `;
    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error(' Erro ao buscar os agendamentos:', erro);
            res.status(500).send('Erro ao buscar agendamentos.');
            return;
        }
        res.json(resultados);
    });
});

// Iniciar o servidor
app.listen(porta, () => {
    console.log(`🌐 Servidor rodando bonitão em http://localhost:${porta}`);
});