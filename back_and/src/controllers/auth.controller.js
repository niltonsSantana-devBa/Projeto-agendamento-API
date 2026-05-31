const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
            process.env.JWT_SECRET || 'segredo_super_secreto',
            { expiresIn: '8h' }
        );

        let profissionalId = null;
        if (usuario.perfil === 'profissional') {
            const [prof] = await pool.query('SELECT id FROM profissionais WHERE usuario_id = ?', [usuario.id]);
            if (prof.length > 0) profissionalId = prof[0].id;
        }

        res.json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, profissionalId }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registrarProfissional = async (req, res) => {
    try {
        const { nome, email, senha, especialidade, telefone } = req.body;

        if (!nome || !email || !senha || !especialidade) {
            return res.status(400).json({ error: 'Nome, email, senha e especialidade são obrigatórios' });
        }

        const senha_hash = await bcrypt.hash(senha, 10);

        const [resultUsuario] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash, perfil, createdAt, updatedAt) VALUES (?, ?, ?, \'profissional\', NOW(), NOW())',
            [nome, email, senha_hash]
        );
        const usuarioId = resultUsuario.insertId;

        const [resultProf] = await pool.query(
            'INSERT INTO profissionais (nome, especialidade, telefone, ativo, usuario_id, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, NOW(), NOW())',
            [nome, especialidade, telefone || null, usuarioId]
        );
        const profissionalId = resultProf.insertId;

        const token = jwt.sign(
            { id: usuarioId, nome, email, perfil: 'profissional' },
            process.env.JWT_SECRET || 'segredo_super_secreto',
            { expiresIn: '8h' }
        );

        res.status(201).json({
            token,
            usuario: { id: usuarioId, nome, email, perfil: 'profissional', profissionalId }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }
        res.status(500).json({ error: error.message });
    }
};
