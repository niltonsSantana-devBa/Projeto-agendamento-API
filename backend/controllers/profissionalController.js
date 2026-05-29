const db = require('../config/db');

exports.listarProfissionais = async (req, res) => {
    try {
        const [resultados] = await db.execute('SELECT * FROM profissionais');
        res.json(resultados);
    } catch (erro) {
        console.error('Erro ao buscar profissionais:', erro);
        res.status(500).json({ erro: 'Erro ao buscar profissionais.' });
    }
};

exports.criarProfissional = async (req, res) => {
    try {
        const { nome, especialidade, telefone } = req.body;
        if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
        
        const [resultado] = await db.execute('INSERT INTO profissionais (nome, especialidade, telefone) VALUES (?, ?, ?)', [nome, especialidade || null, telefone || null]);
        res.status(201).json({ mensagem: 'Profissional criado com sucesso', id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar profissional.' });
    }
};

exports.atualizarProfissional = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, especialidade, telefone } = req.body;
        
        await db.execute('UPDATE profissionais SET nome = ?, especialidade = ?, telefone = ? WHERE id = ?', [nome, especialidade, telefone, id]);
        res.json({ mensagem: 'Profissional atualizado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar profissional.' });
    }
};

exports.deletarProfissional = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM profissionais WHERE id = ?', [id]);
        res.json({ mensagem: 'Profissional deletado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar profissional.' });
    }
};
