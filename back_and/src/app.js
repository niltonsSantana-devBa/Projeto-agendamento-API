require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const clientesRoutes = require('./routes/clientes.routes');
const profissionaisRoutes = require('./routes/profissionais.routes');
const servicosRoutes = require('./routes/servicos.routes');
const agendamentosRoutes = require('./routes/agendamentos.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

const corsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigins.split(','), credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api', authRoutes);

app.get('/api', (req, res) => {
    res.json({ mensagem: 'API AgendaFácil rodando!' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
