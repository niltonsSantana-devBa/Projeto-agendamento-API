const app = require('./src/app');
const pool = require('./src/config/database');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;

async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        const statements = schemaSql
            .replace(/^--.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split(';')
            .map(s => s.trim())
            .filter(s => s && s.length > 0)
            .filter(s => !/^CREATE\s+DATABASE/i.test(s))
            .filter(s => !/^USE\s+/i.test(s));

        for (const stmt of statements) {
            await pool.query(stmt);
        }

        console.log('✅ Schema executado com sucesso');

        const [rows] = await pool.query('SELECT COUNT(*) as total FROM usuarios');
        if (Number(rows[0].total) === 0) {
            const seedPath = path.join(__dirname, 'database', 'seed.sql');
            const seedSql = fs.readFileSync(seedPath, 'utf8');

            const seedStmts = seedSql
                .replace(/^--.*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .split(';')
                .map(s => s.trim())
                .filter(s => s && s.length > 0)
                .filter(s => !/^USE\s+/i.test(s))
                .filter(s => !/SET\s+FOREIGN_KEY_CHECKS/i.test(s));

            await pool.query('SET FOREIGN_KEY_CHECKS = 0');
            for (const stmt of seedStmts) {
                await pool.query(stmt);
            }
            await pool.query('SET FOREIGN_KEY_CHECKS = 1');

            console.log('✅ Seed executado (dados de exemplo inseridos)');
        } else {
            console.log('📦 Banco já possui dados, seed ignorado');
        }
    } catch (error) {
        console.error('❌ Erro na inicializacão do banco:', error.message);
        throw error;
    }
}

async function start() {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`🚀 Servidor AgendaFácil rodando em http://localhost:${port}`);
            console.log(`📡 API disponível em http://localhost:${port}/api`);
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

start();