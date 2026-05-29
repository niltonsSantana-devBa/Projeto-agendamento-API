const db = require('../config/db');

exports.listarAgendamentos = async (req, res) => {
    try {
        const comandoSql = `
            SELECT a.id, c.nome AS cliente, p.nome AS profissional, 
            s.nome AS servico, a.data_hora, a.status, a.criado_em 
            FROM agendamentos a 
            JOIN clientes c ON a.cliente_id = c.id 
            JOIN profissionais p ON a.profissional_id = p.id 
            JOIN servicos s ON a.servico_id = s.id
        `;
        const [resultados] = await db.execute(comandoSql);
        res.json(resultados);
    } catch (erro) {
        console.error('Erro ao buscar agendamentos:', erro);
        res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
    }
};

exports.criarAgendamento = async (req, res) => {
    try {
        const { cliente_id, profissional_id, servico_id, data_hora, status } = req.body;
        if (!cliente_id || !profissional_id || !servico_id || !data_hora) {
            return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
        }
        
        const [resultado] = await db.execute(
            'INSERT INTO agendamentos (cliente_id, profissional_id, servico_id, data_hora, status) VALUES (?, ?, ?, ?, ?)', 
            [cliente_id, profissional_id, servico_id, data_hora, status || 'Agendado']
        );
        res.status(201).json({ mensagem: 'Agendamento criado com sucesso', id: resultado.insertId });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar agendamento.' });
    }
};

exports.atualizarAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente_id, profissional_id, servico_id, data_hora, status } = req.body;
        
        await db.execute(
            'UPDATE agendamentos SET cliente_id = ?, profissional_id = ?, servico_id = ?, data_hora = ?, status = ? WHERE id = ?', 
            [cliente_id, profissional_id, servico_id, data_hora, status, id]
        );
        res.json({ mensagem: 'Agendamento atualizado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar agendamento.' });
    }
};

exports.deletarAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM agendamentos WHERE id = ?', [id]);
        res.json({ mensagem: 'Agendamento deletado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar agendamento.' });
    }
};
