-- ============================================================
-- AgendaFácil - Schema do Banco de Dados
-- Sistema de Agendamento para Clínica de Arquitetura
-- Versão compatível com Sequelize (back_and/scr/index.js)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `mydb`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `mydb`;

-- Remove tabelas antigas que não são mais usadas pelo Sequelize
DROP TABLE IF EXISTS `profissionais`;
DROP TABLE IF EXISTS `serviços`;

-- -----------------------------------------------------------
-- Tabela: Clientes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clientes` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(100) NOT NULL UNIQUE,
  `telefone`   VARCHAR(20)  DEFAULT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- -----------------------------------------------------------
-- Tabela: Profissionals (Sequelize pluraliza "Profissional")
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
-- Tabela: Servicos (Sequelize pluraliza "Servico")
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
-- Tabela: Agendamentos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id`              INT          NOT NULL AUTO_INCREMENT,
  `data`            DATETIME     NOT NULL,
  `status`          VARCHAR(50)  DEFAULT 'pendente',
  `createdAt`       DATETIME     NOT NULL,
  `updatedAt`       DATETIME     NOT NULL,
  `ClienteId`       INT          DEFAULT NULL,
  `ProfissionalId`  INT          DEFAULT NULL,
  `ServicoId`       INT          DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cliente_idx` (`ClienteId`),
  KEY `fk_profissional_idx` (`ProfissionalId`),
  KEY `fk_servico_idx` (`ServicoId`),
  CONSTRAINT `fk_cliente` FOREIGN KEY (`ClienteId`) REFERENCES `clientes` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_profissional` FOREIGN KEY (`ProfissionalId`) REFERENCES `profissionals` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_servico` FOREIGN KEY (`ServicoId`) REFERENCES `servicos` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
