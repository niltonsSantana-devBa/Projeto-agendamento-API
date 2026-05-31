/**
 * Script para recriar o banco de dados do zero.
 * Executar: node scripts/init-db.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    console.log('Conectado ao MySQL. Recriando banco de dados...');

    const sql = `
        DROP DATABASE IF EXISTS \`${process.env.DB_DATABASE || 'mydb'}\`;
        CREATE DATABASE \`${process.env.DB_DATABASE || 'mydb'}\`
            DEFAULT CHARACTER SET utf8mb4
            DEFAULT COLLATE utf8mb4_unicode_ci;
        USE \`${process.env.DB_DATABASE || 'mydb'}\`;

        -- Tabela: profissionais
        CREATE TABLE \`profissionais\` (
            \`id\`            INT          NOT NULL AUTO_INCREMENT,
            \`nome\`          VARCHAR(255) NOT NULL,
            \`especialidade\` VARCHAR(255) NOT NULL,
            \`telefone\`      VARCHAR(50)  DEFAULT NULL,
            \`ativo\`         TINYINT(1)   DEFAULT 1,
            \`createdAt\`     DATETIME     NOT NULL,
            \`updatedAt\`     DATETIME     NOT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        -- Tabela: servicos
        CREATE TABLE \`servicos\` (
            \`id\`              INT             NOT NULL AUTO_INCREMENT,
            \`nome\`            VARCHAR(255)    NOT NULL,
            \`descricao\`       TEXT            DEFAULT NULL,
            \`preco\`           DECIMAL(10,2)   NOT NULL,
            \`duracao_min\`     INT             NOT NULL DEFAULT 60,
            \`profissional_id\` INT             NOT NULL,
            \`createdAt\`       DATETIME        NOT NULL,
            \`updatedAt\`       DATETIME        NOT NULL,
            PRIMARY KEY (\`id\`),
            CONSTRAINT \`fk_servico_profissional\` FOREIGN KEY (\`profissional_id\`)
                REFERENCES \`profissionais\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        -- Tabela: clientes
        CREATE TABLE \`clientes\` (
            \`id\`         INT          NOT NULL AUTO_INCREMENT,
            \`nome\`       VARCHAR(255) NOT NULL,
            \`email\`      VARCHAR(255) NOT NULL,
            \`telefone\`   VARCHAR(50)  DEFAULT NULL,
            \`createdAt\`  DATETIME     NOT NULL,
            \`updatedAt\`  DATETIME     NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`email\` (\`email\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        -- Tabela: agendamentos
        CREATE TABLE \`agendamentos\` (
            \`id\`         INT          NOT NULL AUTO_INCREMENT,
            \`cliente_id\` INT          NOT NULL,
            \`servico_id\` INT          NOT NULL,
            \`data_hora\`  DATETIME     NOT NULL,
            \`status\`     VARCHAR(50)  DEFAULT 'pendente',
            \`observacao\` TEXT         DEFAULT NULL,
            \`createdAt\`  DATETIME     NOT NULL,
            \`updatedAt\`  DATETIME     NOT NULL,
            PRIMARY KEY (\`id\`),
            CONSTRAINT \`fk_agendamento_cliente\` FOREIGN KEY (\`cliente_id\`)
                REFERENCES \`clientes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT \`fk_agendamento_servico\` FOREIGN KEY (\`servico_id\`)
                REFERENCES \`servicos\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        -- Tabela: usuarios
        CREATE TABLE \`usuarios\` (
            \`id\`         INT          NOT NULL AUTO_INCREMENT,
            \`nome\`       VARCHAR(255) NOT NULL,
            \`email\`      VARCHAR(255) NOT NULL,
            \`senha_hash\` VARCHAR(255) NOT NULL,
            \`perfil\`     ENUM('admin','profissional') NOT NULL DEFAULT 'admin',
            \`createdAt\`  DATETIME     NOT NULL,
            \`updatedAt\`  DATETIME     NOT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`email\` (\`email\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        -- Seed: Profissionais
        INSERT INTO \`profissionais\` (\`nome\`, \`especialidade\`, \`telefone\`, \`ativo\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('Dr. Rafael Mendes',   'Arquitetura Residencial', '11911111111', 1, NOW(), NOW()),
        ('Arq. Juliana Torres', 'Design de Interiores',    '11922222222', 1, NOW(), NOW()),
        ('Arq. Pedro Almeida',  'Arquitetura Comercial',   '11933333333', 1, NOW(), NOW());

        -- Seed: Servicos
        INSERT INTO \`servicos\` (\`nome\`, \`descricao\`, \`preco\`, \`duracao_min\`, \`profissional_id\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('Consultoria Inicial',      'Visita t\u00e9cnica para levantamento de necessidades',       250.00,  60, 1, NOW(), NOW()),
        ('Projeto Arquitet\u00f4nico', 'Desenvolvimento completo do projeto',                      5000.00, 120, 1, NOW(), NOW()),
        ('Design de Interiores',     'Projeto de decora\u00e7\u00e3o e ambienta\u00e7\u00e3o de espa\u00e7os', 3000.00, 90, 2, NOW(), NOW()),
        ('Consultoria de Interiores','Orienta\u00e7\u00f5es para escolha de m\u00f3veis e cores',          350.00,  60, 2, NOW(), NOW()),
        ('Projeto Comercial',        'Projeto para estabelecimentos comerciais',                   6000.00, 120, 3, NOW(), NOW()),
        ('Acompanhamento de Obra',   'Visita semanal para acompanhamento da execu\u00e7\u00e3o',        800.00,   60, 3, NOW(), NOW());

        -- Seed: Clientes
        INSERT INTO \`clientes\` (\`nome\`, \`email\`, \`telefone\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('Ana Oliveira',  'ana@email.com',   '11987654321', NOW(), NOW()),
        ('Carlos Santos', 'carlos@email.com','11912345678', NOW(), NOW()),
        ('Marina Costa',  'marina@email.com','21987654321', NOW(), NOW());

        -- Seed: Agendamentos
        INSERT INTO \`agendamentos\` (\`data_hora\`, \`status\`, \`cliente_id\`, \`servico_id\`, \`observacao\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('2026-06-15 09:00:00', 'confirmado', 1, 1, 'Cliente quer reformar sala de estar',         NOW(), NOW()),
        ('2026-06-18 14:30:00', 'pendente',   2, 3, 'Apartamento novo, precisa de projeto completo', NOW(), NOW()),
        ('2026-06-20 10:00:00', 'pendente',   3, 6, 'Acompanhamento quinzenal',                    NOW(), NOW());

        -- Seed: Usuario admin (senha: admin123)
        INSERT INTO \`usuarios\` (\`nome\`, \`email\`, \`senha_hash\`, \`perfil\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('Administrador', 'admin@agendafacil.com', '$2a$10$fWBH5vL1nNTt8OGga0tiwusxZKKtgiHD7EXgk0Gosf9bWLV4HpWfy', 'admin', NOW(), NOW());
    `;

    try {
        await connection.query(sql);
        console.log('Banco de dados recriado com sucesso!');
        console.log('Usuario: admin@agendafacil.com / Senha: admin123');
    } catch (error) {
        console.error('Erro ao recriar banco:', error.message);
    } finally {
        await connection.end();
    }
}

init();
