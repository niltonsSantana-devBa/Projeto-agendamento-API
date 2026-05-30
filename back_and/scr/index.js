require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize, DataTypes } = require('sequelize');

// --- 1. CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS ---
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, { dialect: 'mysql', logging: false })
    : new Sequelize(
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
const corsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigins.split(','), credentials: true }));
app.use(helmet());
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
        if (!req.body.nome || !req.body.email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [atualizado] = await Cliente.update(req.body, { where: { id } });
        if (!atualizado) return res.status(404).json({ error: 'Cliente não encontrado' });
        const cliente = await Cliente.findByPk(id);
        res.json(cliente);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Cliente.destroy({ where: { id } });
        if (!deletado) return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json({ mensagem: 'Cliente removido com sucesso' });
    } catch (error) { res.status(500).json({ error: error.message }); }
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
        if (!req.body.nome || !req.body.especialidade) {
            return res.status(400).json({ error: 'Nome e especialidade são obrigatórios' });
        }
        const profissional = await Profissional.create(req.body);
        res.status(201).json(profissional);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/profissionais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [atualizado] = await Profissional.update(req.body, { where: { id } });
        if (!atualizado) return res.status(404).json({ error: 'Profissional não encontrado' });
        const profissional = await Profissional.findByPk(id);
        res.json(profissional);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/profissionais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Profissional.destroy({ where: { id } });
        if (!deletado) return res.status(404).json({ error: 'Profissional não encontrado' });
        res.json({ mensagem: 'Profissional removido com sucesso' });
    } catch (error) { res.status(500).json({ error: error.message }); }
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
        if (!req.body.nome || !req.body.preco) {
            return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
        }
        const servico = await Servico.create(req.body);
        res.status(201).json(servico);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [atualizado] = await Servico.update(req.body, { where: { id } });
        if (!atualizado) return res.status(404).json({ error: 'Serviço não encontrado' });
        const servico = await Servico.findByPk(id);
        res.json(servico);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Servico.destroy({ where: { id } });
        if (!deletado) return res.status(404).json({ error: 'Serviço não encontrado' });
        res.json({ mensagem: 'Serviço removido com sucesso' });
    } catch (error) { res.status(500).json({ error: error.message }); }
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
        if (!req.body.data || !req.body.ClienteId || !req.body.ProfissionalId || !req.body.ServicoId) {
            return res.status(400).json({ error: 'Data, cliente, profissional e serviço são obrigatórios' });
        }
        const agendamento = await Agendamento.create(req.body);
        res.status(201).json(agendamento);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [atualizado] = await Agendamento.update(req.body, { where: { id } });
        if (!atualizado) return res.status(404).json({ error: 'Agendamento não encontrado' });
        const agendamento = await Agendamento.findByPk(id, {
            include: [Cliente, Profissional, Servico]
        });
        res.json(agendamento);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Agendamento.destroy({ where: { id } });
        if (!deletado) return res.status(404).json({ error: 'Agendamento não encontrado' });
        res.json({ mensagem: 'Agendamento removido com sucesso' });
    } catch (error) { res.status(500).json({ error: error.message }); }
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
