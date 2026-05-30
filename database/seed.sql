-- ============================================================
-- AgendaFácil - Dados de Exemplo (Seed)
-- ============================================================

USE `mydb`;
SET FOREIGN_KEY_CHECKS = 0;

-- Clientes
TRUNCATE TABLE `clientes`;
INSERT INTO `clientes` (`nome`, `email`, `telefone`, `createdAt`, `updatedAt`) VALUES
('Ana Oliveira', 'ana@email.com', '11987654321', NOW(), NOW()),
('Carlos Santos', 'carlos@email.com', '11912345678', NOW(), NOW()),
('Marina Costa', 'marina@email.com', '21987654321', NOW(), NOW());

-- Profissionais
TRUNCATE TABLE `profissionals`;
INSERT INTO `profissionals` (`nome`, `especialidade`, `createdAt`, `updatedAt`) VALUES
('Dr. Rafael Mendes', 'Arquitetura Residencial', NOW(), NOW()),
('Arq. Juliana Torres', 'Design de Interiores', NOW(), NOW()),
('Arq. Pedro Almeida', 'Arquitetura Comercial', NOW(), NOW());

-- Serviços
TRUNCATE TABLE `servicos`;
INSERT INTO `servicos` (`nome`, `descricao`, `preco`, `createdAt`, `updatedAt`) VALUES
('Consultoria Inicial', 'Visita técnica para levantamento de necessidades', 250.00, NOW(), NOW()),
('Projeto Arquitetônico', 'Desenvolvimento completo do projeto', 5000.00, NOW(), NOW()),
('Acompanhamento de Obra', 'Visita semanal para acompanhamento da execução', 800.00, NOW(), NOW());

-- Agendamentos
TRUNCATE TABLE `agendamentos`;
INSERT INTO `agendamentos` (`data`, `status`, `ClienteId`, `ProfissionalId`, `ServicoId`, `createdAt`, `updatedAt`) VALUES
('2026-06-15 09:00:00', 'confirmado', 1, 1, 1, NOW(), NOW()),
('2026-06-18 14:30:00', 'pendente', 2, 2, 2, NOW(), NOW()),
('2026-06-20 10:00:00', 'pendente', 3, 3, 3, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
