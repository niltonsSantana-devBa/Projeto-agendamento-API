const pool = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM profissionais ORDER BY nome');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        if (!req.body.nome || !req.body.especialidade) {
            return res.status(400).json({ error: 'Nome e especialidade são obrigatórios' });
        }
        const { nome, especialidade, telefone, ativo } = req.body;
        const [result] = await pool.query(
            'INSERT INTO profissionais (nome, especialidade, telefone, ativo, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [nome, especialidade, telefone || null, ativo !== undefined ? ativo : 1]
        );
        const [profissional] = await pool.query('SELECT * FROM profissionais WHERE id = ?', [result.insertId]);
        res.status(201).json(profissional[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const [atual] = await pool.query('SELECT * FROM profissionais WHERE id = ?', [id]);
        if (atual.length === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado' });
        }

        const dadosAtuais = atual[0];
        const nome = req.body.nome ?? dadosAtuais.nome;
        const especialidade = req.body.especialidade ?? dadosAtuais.especialidade;
        const telefone = req.body.telefone ?? dadosAtuais.telefone;
        const ativo = req.body.ativo !== undefined ? req.body.ativo : dadosAtuais.ativo;

        await pool.query(
            'UPDATE profissionais SET nome = ?, especialidade = ?, telefone = ?, ativo = ?, updatedAt = NOW() WHERE id = ?',
            [nome, especialidade, telefone, ativo, id]
        );

        const [profissional] = await pool.query('SELECT * FROM profissionais WHERE id = ?', [id]);
        res.json(profissional[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM profissionais WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado' });
        }
        res.json({ mensagem: 'Profissional removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
