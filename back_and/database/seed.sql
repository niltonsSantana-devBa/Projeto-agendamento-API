-- AgendaFácil - Dados de Exemplo (Seed)
-- Gere o hash da senha com: node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"

USE `mydb`;
SET FOREIGN_KEY_CHECKS = 0;

-- Profissionais
TRUNCATE TABLE `profissionais`;
INSERT INTO `profissionais` (`nome`, `especialidade`, `telefone`, `ativo`, `createdAt`, `updatedAt`) VALUES
('Dr. Rafael Mendes',     'Arquitetura Residencial', '11911111111', 1, NOW(), NOW()),
('Arq. Juliana Torres',   'Design de Interiores',    '11922222222', 1, NOW(), NOW()),
('Arq. Pedro Almeida',    'Arquitetura Comercial',   '11933333333', 1, NOW(), NOW());

-- Servicos (agora com profissional_id e duracao_min)
TRUNCATE TABLE `servicos`;
INSERT INTO `servicos` (`nome`, `descricao`, `preco`, `duracao_min`, `profissional_id`, `createdAt`, `updatedAt`) VALUES
('Consultoria Inicial',       'Visita técnica para levantamento de necessidades',       250.00,  60, 1, NOW(), NOW()),
('Projeto Arquitetônico',     'Desenvolvimento completo do projeto',                   5000.00, 120, 1, NOW(), NOW()),
('Design de Interiores',      'Projeto de decoração e ambientação de espaços',         3000.00,  90, 2, NOW(), NOW()),
('Consultoria de Interiores', 'Orientações para escolha de móveis e cores',             350.00,  60, 2, NOW(), NOW()),
('Projeto Comercial',         'Projeto para estabelecimentos comerciais',              6000.00, 120, 3, NOW(), NOW()),
('Acompanhamento de Obra',   'Visita semanal para acompanhamento da execução',         800.00,   60, 3, NOW(), NOW());

-- Clientes
TRUNCATE TABLE `clientes`;
INSERT INTO `clientes` (`nome`, `email`, `telefone`, `createdAt`, `updatedAt`) VALUES
('Ana Oliveira',  'ana@email.com',   '11987654321', NOW(), NOW()),
('Carlos Santos', 'carlos@email.com','11912345678', NOW(), NOW()),
('Marina Costa',  'marina@email.com','21987654321', NOW(), NOW());

-- Agendamentos (sem ProfissionalId — o profissional é definido pelo serviço)
TRUNCATE TABLE `agendamentos`;
INSERT INTO `agendamentos` (`data_hora`, `status`, `cliente_id`, `servico_id`, `observacao`, `createdAt`, `updatedAt`) VALUES
('2026-06-15 09:00:00', 'confirmado', 1, 1, 'Cliente quer reformar sala de estar',        NOW(), NOW()),
('2026-06-18 14:30:00', 'pendente',   2, 3, 'Apartamento novo, precisa de projeto completo', NOW(), NOW()),
('2026-06-20 10:00:00', 'pendente',   3, 6, 'Acompanhamento quinzenal',                   NOW(), NOW());

-- Usuario admin (senha: admin123)
TRUNCATE TABLE `usuarios`;
INSERT INTO `usuarios` (`nome`, `email`, `senha_hash`, `perfil`, `createdAt`, `updatedAt`) VALUES
('Administrador', 'admin@agendafacil.com', '$2a$10$fWBH5vL1nNTt8OGga0tiwusxZKKtgiHD7EXgk0Gosf9bWLV4HpWfy', 'admin', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
