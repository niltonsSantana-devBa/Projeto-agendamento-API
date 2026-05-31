-- AgendaFácil - Schema do Banco de Dados
-- Conforme plano das disciplinas BD + Front-End

CREATE DATABASE IF NOT EXISTS `mydb`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `mydb`;

-- -----------------------------------------------------------
-- Tabela: profissionais
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profissionais` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `nome`          VARCHAR(255) NOT NULL,
  `especialidade` VARCHAR(255) NOT NULL,
  `telefone`      VARCHAR(50)  DEFAULT NULL,
  `ativo`         TINYINT(1)   DEFAULT 1,
  `createdAt`     DATETIME     NOT NULL,
  `updatedAt`     DATETIME     NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabela: servicos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `servicos` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `nome`            VARCHAR(255)    NOT NULL,
  `descricao`       TEXT            DEFAULT NULL,
  `preco`           DECIMAL(10,2)   NOT NULL,
  `duracao_min`     INT             NOT NULL DEFAULT 60,
  `profissional_id` INT             NOT NULL,
  `createdAt`       DATETIME        NOT NULL,
  `updatedAt`       DATETIME        NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_servico_profissional` (`profissional_id`),
  CONSTRAINT `fk_servico_profissional` FOREIGN KEY (`profissional_id`)
    REFERENCES `profissionais` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabela: clientes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clientes` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `telefone`   VARCHAR(50)  DEFAULT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabela: agendamentos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `cliente_id` INT          NOT NULL,
  `servico_id` INT          NOT NULL,
  `data_hora`  DATETIME     NOT NULL,
  `status`     VARCHAR(50)  DEFAULT 'pendente',
  `observacao` TEXT         DEFAULT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_agendamento_cliente` (`cliente_id`),
  KEY `fk_agendamento_servico` (`servico_id`),
  CONSTRAINT `fk_agendamento_cliente` FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_agendamento_servico` FOREIGN KEY (`servico_id`)
    REFERENCES `servicos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabela: usuarios
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil`     ENUM('admin','profissional') NOT NULL DEFAULT 'admin',
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
