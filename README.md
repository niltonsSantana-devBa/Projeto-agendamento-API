# 🏛️ Sistema de Agendamento - Clínica de Arquitetura

## 📖 Sobre o Projeto
Este é o banco de dados e backend para um sistema de agendamentos focado em escritórios e clínicas de arquitetura. O sistema permite gerenciar clientes, arquitetos, serviços oferecidos e os agendamentos das visitas (seja online, no escritório ou na obra).

## 🛠️ Tecnologias Utilizadas
* **Banco de Dados:** MySQL
* **Modelagem:** MySQL Workbench
* **Backend:** [Node.js / Express - Adicione depois quando fizermos!]

## 🗄️ Modelagem do Banco de Dados (DER)
Abaixo está o Diagrama Entidade-Relacionamento (DER) que estrutura o sistema:

![Diagrama do Banco de Dados](imagem%20projeto.png)

### 📋 Descrição das Tabelas
* **Clientes:** Armazena os dados dos clientes, incluindo o endereço da obra.
* **Profissionais:** Registro dos arquitetos, suas especialidades e número do CAU (Conselho de Arquitetura e Urbanismo).
* **Servicos:** Catálogo de serviços oferecidos pelo escritório (ex: Visita Técnica, Projeto 3D), com duração e preço.
* **Agendamentos:** O coração do sistema. Une o cliente, o serviço e o profissional, registrando a data, hora, status e modalidade do encontro.
