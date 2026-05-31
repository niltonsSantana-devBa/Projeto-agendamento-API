const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
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

        res.json({
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
