const pool = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.buscarPorEmail = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ?', [req.params.email]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        if (!req.body.nome || !req.body.email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }
        const { nome, email, telefone } = req.body;
        const [result] = await pool.query(
            'INSERT INTO clientes (nome, email, telefone, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            [nome, email, telefone || null]
        );
        const [cliente] = await pool.query('SELECT * FROM clientes WHERE id = ?', [result.insertId]);
        res.status(201).json(cliente[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const [atual] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
        if (atual.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const dadosAtuais = atual[0];
        const nome = req.body.nome ?? dadosAtuais.nome;
        const email = req.body.email ?? dadosAtuais.email;
        const telefone = req.body.telefone ?? dadosAtuais.telefone;

        await pool.query(
            'UPDATE clientes SET nome = ?, email = ?, telefone = ?, updatedAt = NOW() WHERE id = ?',
            [nome, email, telefone, id]
        );

        const [cliente] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
        res.json(cliente[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ mensagem: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
