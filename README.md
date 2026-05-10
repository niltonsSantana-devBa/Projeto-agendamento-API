# 🏛️ AgendaFácil - Clínica de Arquitetura

Este é um sistema completo de backend e interface visual para gerenciamento de agendamentos em escritórios de arquitetura. O sistema permite o controle de clientes, profissionais, serviços e visitas técnicas.

## 📖 Sobre o Projeto
O projeto foi desenvolvido para oferecer uma solução robusta e segura para a gestão de agendamentos. Ele conta com um servidor Node.js que se comunica com um banco de dados MySQL e uma interface de Dashboard moderna para visualização dos dados.

## 🛠️ Tecnologias Utilizadas
*   **Backend:** [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
*   **Banco de Dados:** MySQL
*   **Segurança:** [Dotenv](https://www.npmjs.com/package/dotenv) para gestão de variáveis de ambiente
*   **Frontend:** HTML5, CSS3 (Vanilla) e JavaScript (ES6+)
*   **Ícones:** Font Awesome

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
*   Node.js instalado.
*   MySQL Server rodando localmente.
*   Banco de dados `mydb` criado com as tabelas: `clientes`, `profissionais`, `servicos` e `agendamentos`.

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=mydb
PORT=3000
```

### 3. Instalação
```bash
npm install
```

### 4. Execução
Para rodar o servidor:
```bash
npm start
```
Para modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```
O sistema estará disponível em: `http://localhost:3000`

## 🔗 Endpoints da API
O backend oferece as seguintes rotas JSON:
*   `GET /clientes`: Retorna todos os clientes cadastrados.
*   `GET /profissionais`: Retorna a lista de arquitetos.
*   `GET /servicos`: Retorna o catálogo de serviços.
*   `GET /agendamentos`: Retorna os agendamentos vinculados (com nomes de clientes e profissionais).

## 🖥️ Interface (Dashboard)
A interface visual foi construída com um design premium focado na experiência do usuário, utilizando:
*   **Dark Mode:** Estética moderna e elegante.
*   **Glassmorphism:** Efeitos de transparência e profundidade.
*   **Navegação SPA:** Troca de abas dinâmica sem recarregar a página.

---
Desenvolvido como parte do projeto interdisciplinar SENAI.
