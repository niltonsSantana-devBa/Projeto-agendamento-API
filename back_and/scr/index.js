require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// --- 1. CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS ---
const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'mydb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

// --- 2. DEFINIÇÃO DOS MODELOS (TABELAS) ---
const Cliente = sequelize.define('Cliente', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING }
});

const Profissional = sequelize.define('Profissional', {
    nome: { type: DataTypes.STRING, allowNull: false },
    especialidade: { type: DataTypes.STRING, allowNull: false }
});

const Servico = sequelize.define('Servico', {
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

const Agendamento = sequelize.define('Agendamento', {
    data: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pendente' }
});

// Relacionamentos
Cliente.hasMany(Agendamento);
Agendamento.belongsTo(Cliente);
Profissional.hasMany(Agendamento);
Agendamento.belongsTo(Profissional);
Servico.hasMany(Agendamento);
Agendamento.belongsTo(Servico);

// --- 3. CONFIGURAÇÃO DO SERVIDOR EXPRESS ---
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// --- 4. DEFINIÇÃO DAS ROTAS (ENDPOINTS) ---

// Clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/clientes', async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// Profissionais
app.get('/profissionais', async (req, res) => {
    try {
        const profissionais = await Profissional.findAll();
        res.json(profissionais);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/profissionais', async (req, res) => {
    try {
        const profissional = await Profissional.create(req.body);
        res.status(201).json(profissional);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// Serviços
app.get('/servicos', async (req, res) => {
    try {
        const servicos = await Servico.findAll();
        res.json(servicos);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/servicos', async (req, res) => {
    try {
        const servico = await Servico.create(req.body);
        res.status(201).json(servico);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// Agendamentos
app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [Cliente, Profissional, Servico]
        });
        res.json(agendamentos);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/agendamentos', async (req, res) => {
    try {
        const agendamento = await Agendamento.create(req.body);
        res.status(201).json(agendamento);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// --- 5. INICIANDO O SERVIDOR E SINCRONIZANDO COM O BANCO ---
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Servidor AgendaFácil rodando em http://localhost:${port}`);
        console.log('✅ Banco de dados sincronizado (Sequelize em arquivo único).');
    });
}).catch((error) => {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
});
