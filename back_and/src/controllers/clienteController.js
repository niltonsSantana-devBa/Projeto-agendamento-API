const db = require('../config/db');

exports.listarClientes = async (req, res) => {
    try {
        const [resultados] = await db.execute('SELECT * FROM clientes');
        res.json(resultados);
    } catch (erro) {
        console.error('Erro ao buscar os clientes:', erro);
        res.status(500).json({ erro: 'Erro ao buscar clientes.' });
    }
};

exports.criarCliente = async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
        
        const [resultado] = await db.execute('INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)', [nome, email || null, telefone || null]);
        res.status(201).json({ mensagem: 'Cliente criado com sucesso', id: resultado.insertId });
    } catch (erro) {
        console.error('Erro ao criar cliente:', erro);
        res.status(500).json({ erro: 'Erro ao criar cliente.' });
    }
};

exports.atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;
        
        await db.execute('UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?', [nome, email, telefone, id]);
        res.json({ mensagem: 'Cliente atualizado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
    }
};

exports.deletarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM clientes WHERE id = ?', [id]);
        res.json({ mensagem: 'Cliente deletado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar cliente.' });
    }
};
