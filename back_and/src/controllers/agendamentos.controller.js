const pool = require('../config/database');

exports.listar = async (req, res) => {
    try {
        let query = `
            SELECT a.id, a.data_hora, a.status, a.observacao, a.createdAt, a.updatedAt,
                   c.id AS cliente_id, c.nome AS cliente_nome, c.email AS cliente_email, c.telefone AS cliente_telefone,
                   s.id AS servico_id, s.nome AS servico_nome, s.preco AS servico_preco,
                   p.id AS profissional_id, p.nome AS profissional_nome, p.especialidade AS profissional_especialidade
            FROM agendamentos a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN servicos s ON a.servico_id = s.id
            JOIN profissionais p ON s.profissional_id = p.id
        `;
        const params = [];

        if (req.query.data) {
            query += ' WHERE DATE(a.data_hora) = ?';
            params.push(req.query.data);
        }

        query += ' ORDER BY a.data_hora DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        if (!req.body.data_hora || !req.body.cliente_id || !req.body.servico_id) {
            return res.status(400).json({ error: 'Data/hora, cliente e serviço são obrigatórios' });
        }
        const { data_hora, cliente_id, servico_id, status, observacao } = req.body;
        const [result] = await pool.query(
            'INSERT INTO agendamentos (data_hora, cliente_id, servico_id, status, observacao, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [data_hora, cliente_id, servico_id, status || 'pendente', observacao || null]
        );
        const [agendamento] = await pool.query(
            `SELECT a.id, a.data_hora, a.status, a.observacao, a.createdAt, a.updatedAt,
                    c.id AS cliente_id, c.nome AS cliente_nome,
                    s.id AS servico_id, s.nome AS servico_nome,
                    p.id AS profissional_id, p.nome AS profissional_nome
             FROM agendamentos a
             JOIN clientes c ON a.cliente_id = c.id
             JOIN servicos s ON a.servico_id = s.id
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE a.id = ?`,
            [result.insertId]
        );
        res.status(201).json(agendamento[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const [atual] = await pool.query('SELECT * FROM agendamentos WHERE id = ?', [id]);
        if (atual.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        const dadosAtuais = atual[0];
        const data_hora = req.body.data_hora ?? dadosAtuais.data_hora;
        const cliente_id = req.body.cliente_id ?? dadosAtuais.cliente_id;
        const servico_id = req.body.servico_id ?? dadosAtuais.servico_id;
        const status = req.body.status ?? dadosAtuais.status;
        const observacao = req.body.observacao ?? dadosAtuais.observacao;

        await pool.query(
            'UPDATE agendamentos SET data_hora = ?, cliente_id = ?, servico_id = ?, status = ?, observacao = ?, updatedAt = NOW() WHERE id = ?',
            [data_hora, cliente_id, servico_id, status, observacao, id]
        );

        const [agendamento] = await pool.query(
            `SELECT a.id, a.data_hora, a.status, a.observacao, a.createdAt, a.updatedAt,
                    c.id AS cliente_id, c.nome AS cliente_nome, c.email AS cliente_email, c.telefone AS cliente_telefone,
                    s.id AS servico_id, s.nome AS servico_nome, s.preco AS servico_preco,
                    p.id AS profissional_id, p.nome AS profissional_nome
             FROM agendamentos a
             JOIN clientes c ON a.cliente_id = c.id
             JOIN servicos s ON a.servico_id = s.id
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE a.id = ?`,
            [id]
        );
        res.json(agendamento[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.listarMeus = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.id, a.data_hora, a.status, a.observacao, a.createdAt, a.updatedAt,
                    c.id AS cliente_id, c.nome AS cliente_nome, c.email AS cliente_email, c.telefone AS cliente_telefone,
                    s.id AS servico_id, s.nome AS servico_nome, s.preco AS servico_preco,
                    p.id AS profissional_id, p.nome AS profissional_nome
             FROM agendamentos a
             JOIN clientes c ON a.cliente_id = c.id
             JOIN servicos s ON a.servico_id = s.id
             JOIN profissionais p ON s.profissional_id = p.id
             WHERE p.usuario_id = ?
             ORDER BY a.data_hora DESC`,
            [req.usuario.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM agendamentos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        res.json({ mensagem: 'Agendamento removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
