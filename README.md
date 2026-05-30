# 🏛️ AgendaFácil - Clínica de Arquitetura

Este é um sistema completo de backend e interface visual para gerenciamento de agendamentos em escritórios de arquitetura. O sistema permite o controle de clientes, profissionais, serviços e visitas técnicas.

## 📖 Sobre o Projeto e Reestruturação
O projeto foi recentemente reestruturado para adotar uma arquitetura mais moderna, baseando-se em um modelo de referência (`pa-99160`).
Agora ele é dividido claramente em duas partes independentes:
- **`front_end/`**: Uma Single Page Application construída com React e Vite, proporcionando navegação instantânea e componentização de código.
- **`back_and/`**: Uma API RESTful robusta em Node.js usando Express, e agora utilizando o **Sequelize** como ORM para um gerenciamento mais seguro e eficiente do banco de dados MySQL.

## 🛠️ Tecnologias Utilizadas
*   **Backend (`back_and`)**: [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/) (ORM) e [MySQL2](https://www.npmjs.com/package/mysql2).
*   **Frontend (`front_end`)**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Axios](https://axios-http.com/).
*   **Banco de Dados:** MySQL
*   **Segurança:** [Dotenv](https://www.npmjs.com/package/dotenv), Helmet, CORS.

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
*   Node.js instalado.
*   MySQL Server rodando localmente.
*   Banco de dados `mydb` configurado com as tabelas de domínio.

### 2. Configurando o Backend (`back_and`)
Crie ou edite o arquivo `.env` dentro da pasta `back_and`:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=mydb
PORT=3000
```
Instale as dependências e inicie o servidor:
```bash
cd back_and
npm install
npm run dev
```

### 3. Configurando o Frontend (`front_end`)
Abra um novo terminal e inicie a interface de usuário:
```bash
cd front_end
npm install
npm run dev
```
O frontend estará acessível em: `http://localhost:5173`

## 🔗 Endpoints da API (Migração em andamento)
As rotas mantêm a mesma estrutura, agora conectadas ao Sequelize:
*   `GET /clientes`
*   `GET /profissionais`
*   `GET /servicos`
*   `GET /agendamentos`

---
Desenvolvido como parte do projeto interdisciplinar SENAI.
