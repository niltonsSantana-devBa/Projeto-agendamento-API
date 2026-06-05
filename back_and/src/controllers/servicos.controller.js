const pool = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT s.*, p.nome AS profissional_nome
             FROM servicos s
             JOIN profissionais p ON s.profissional_id = p.id
             ORDER BY s.nome`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listarPorProfissional = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM servicos WHERE profissional_id = ? ORDER BY nome',
            [req.params.profissionalId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listarMeus = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT s.*, p.nome AS profissional_nome
             FROM servicos s
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE p.usuario_id = ?
             ORDER BY s.nome`,
            [req.usuario.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        if (!req.body.nome || !req.body.preco || !req.body.profissional_id) {
            return res.status(400).json({ error: 'Nome, preço e profissional são obrigatórios' });
        }
        const { nome, descricao, preco, duracao_min, profissional_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO servicos (nome, descricao, preco, duracao_min, profissional_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [nome, descricao || null, preco, duracao_min || 60, profissional_id]
        );
        const [servico] = await pool.query(
            `SELECT s.*, p.nome AS profissional_nome
             FROM servicos s
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE s.id = ?`,
            [result.insertId]
        );
        res.status(201).json(servico[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const [atual] = await pool.query('SELECT * FROM servicos WHERE id = ?', [id]);
        if (atual.length === 0) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        const dadosAtuais = atual[0];
        const nome = req.body.nome ?? dadosAtuais.nome;
        const descricao = req.body.descricao ?? dadosAtuais.descricao;
        const preco = req.body.preco ?? dadosAtuais.preco;
        const duracao_min = req.body.duracao_min ?? dadosAtuais.duracao_min;
        const profissional_id = req.body.profissional_id ?? dadosAtuais.profissional_id;

        await pool.query(
            'UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao_min = ?, profissional_id = ?, updatedAt = NOW() WHERE id = ?',
            [nome, descricao, preco, duracao_min, profissional_id, id]
        );
        const [servico] = await pool.query(
            `SELECT s.*, p.nome AS profissional_nome
             FROM servicos s
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE s.id = ?`,
            [id]
        );
        res.json(servico[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM servicos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json({ mensagem: 'Serviço removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
