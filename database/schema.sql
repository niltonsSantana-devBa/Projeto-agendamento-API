-- ============================================================
-- AgendaFácil - Schema do Banco de Dados
-- Sistema de Agendamento para Clínica de Arquitetura
-- Gerado automaticamente pelo Sequelize
-- ============================================================

CREATE DATABASE IF NOT EXISTS `mydb`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `mydb`;

-- -----------------------------------------------------------
-- Tabela: clientes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clientes` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `telefone`   VARCHAR(255) DEFAULT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------------
-- Tabela: profissionals
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profissionals` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `nome`          VARCHAR(255) NOT NULL,
  `especialidade` VARCHAR(255) NOT NULL,
  `createdAt`     DATETIME     NOT NULL,
  `updatedAt`     DATETIME     NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------------
-- Tabela: servicos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `servicos` (
  `id`        INT             NOT NULL AUTO_INCREMENT,
  `nome`      VARCHAR(255)    NOT NULL,
  `descricao` TEXT            DEFAULT NULL,
  `preco`     DECIMAL(10, 2)  NOT NULL,
  `createdAt` DATETIME        NOT NULL,
  `updatedAt` DATETIME        NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------------
-- Tabela: agendamentos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id`              INT          NOT NULL AUTO_INCREMENT,
  `data`            DATETIME     NOT NULL,
  `status`          VARCHAR(255) DEFAULT 'pendente',
  `createdAt`       DATETIME     NOT NULL,
  `updatedAt`       DATETIME     NOT NULL,
  `ClienteId`       INT          DEFAULT NULL,
  `ProfissionalId`  INT          DEFAULT NULL,
  `ServicoId`       INT          DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ClienteId` (`ClienteId`),
  KEY `ProfissionalId` (`ProfissionalId`),
  KEY `ServicoId` (`ServicoId`),
  CONSTRAINT `fk_agendamento_cliente` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_agendamento_profissional` FOREIGN KEY (`ProfissionalId`) REFERENCES `profissionals` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_agendamento_servico` FOREIGN KEY (`ServicoId`) REFERENCES `servicos` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
