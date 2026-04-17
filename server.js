const express = require('express');
const mysql = require('mysql2'); // Puxando o "tradutor" do banco de dados

const app = express();
const porta = 3000;

app.use(express.json());

// 🗄️ Criando a conexão com o banco de dados
const conexao = mysql.createConnection({
    host: 'localhost', // O banco está no seu computador
    user: 'root',      // Seu usuário do MySQL (geralmente é root)
    password: 'NILton@1112',      // Sua senha do MySQL (se tiver senha no Workbench, coloque aqui!)
    database: 'mydb'   // O nome do seu banco (conforme estava na sua foto)
});

// 🔍 Testando se a conexão deu certo
conexao.connect((erro) => {
    if (erro) {
        console.error('❌ Erro ao conectar com o banco de dados:', erro);
        return;
    }
    console.log('✅ Conectado ao banco de dados MySQL com sucesso! 🗄️');
});

// Rota principal (aquela do navegador)
app.get('/', (req, res) => {
    res.send('Fala, dev! O servidor da Clínica de Arquitetura está ON e conectado ao banco! 🚀');
});

// Ligando o servidor
app.listen(porta, () => {
    console.log(`🌐 Servidor rodando bonitão em http://localhost:${porta}`);
});