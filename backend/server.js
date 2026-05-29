require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const porta = process.env.PORT || 3000;

// Middlewares de segurança e utilidades
app.use(helmet());
app.use(cors());
app.use(express.json());

// Importar Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const profissionalRoutes = require('./routes/profissionalRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

// Rota inicial
app.get('/', (req, res) => {
    res.send('O servidor está ON, seguro e usando arquitetura MVC!');
});

// Usar Rotas
app.use('/clientes', clienteRoutes);
app.use('/profissionais', profissionalRoutes);
app.use('/servicos', servicoRoutes);
app.use('/agendamentos', agendamentoRoutes);

// Iniciar o servidor
app.listen(porta, () => {
    console.log(`🌐 Servidor rodando bonitão em http://localhost:${porta}`);
});