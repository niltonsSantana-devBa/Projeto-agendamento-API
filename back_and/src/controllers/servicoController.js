const db = require('../config/db');

exports.listarServicos = async (req, res) => {
    try {
        const [resultados] = await db.execute('SELECT * FROM servicos');
        res.json(resultados);
    } catch (erro) {
        console.error('Erro ao buscar servicos:', erro);
        res.status(500).json({ erro: 'Erro ao buscar serviços.' });
    }
};

exports.criarServico = async (req, res) => {
    try {
        const { nome, descricao, preco, duracao_minutos } = req.body;
        if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
        
        const [resultado] = await db.execute('INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES (?, ?, ?, ?)', [nome, descricao || null, preco || null, duracao_minutos || null]);
        res.status(201).json({ mensagem: 'Serviço criado com sucesso', id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar serviço.' });
    }
};

exports.atualizarServico = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, duracao_minutos } = req.body;
        
        await db.execute('UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao_minutos = ? WHERE id = ?', [nome, descricao, preco, duracao_minutos, id]);
        res.json({ mensagem: 'Serviço atualizado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar serviço.' });
    }
};

exports.deletarServico = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM servicos WHERE id = ?', [id]);
        res.json({ mensagem: 'Serviço deletado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar serviço.' });
    }
};
