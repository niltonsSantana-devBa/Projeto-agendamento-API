const app = require('./src/app');

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`🚀 Servidor AgendaFácil rodando em http://localhost:${port}`);
    console.log(`📡 API disponível em http://localhost:${port}/api`);
});
