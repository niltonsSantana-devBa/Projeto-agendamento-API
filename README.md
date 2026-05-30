# 🏛️ AgendaFácil — Sistema de Agendamento para Clínica de Arquitetura

**AgendaFácil** é uma aplicação web completa para gerenciamento de agendamentos em escritórios e clínicas de arquitetura. O sistema permite cadastrar clientes, profissionais (arquitetos), serviços oferecidos e as visitas agendadas (seja online, no escritório ou na obra), com interface moderna e banco de dados relacional.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como o Projeto Funciona](#como-o-projeto-funciona)
- [Banco de Dados](#banco-de-dados)
- [API REST — Endpoints](#api-rest--endpoints)
- [Frontend — Telas e Componentes](#frontend--telas-e-componentes)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 📖 Sobre o Projeto

O AgendaFácil foi desenvolvido como um sistema fullstack com separação clara entre frontend (interface) e backend (API). A aplicação segue o modelo de Single Page Application (SPA) no frontend, onde a navegação acontece sem recarregar a página, e uma API RESTful no backend que se comunica com um banco de dados MySQL usando o ORM Sequelize.

O sistema é voltado para escritórios de arquitetura que precisam gerenciar:
- **Clientes**: Quem solicita os serviços.
- **Profissionais**: Os arquitetos responsáveis pelas visitas.
- **Serviços**: O catálogo de serviços oferecidos.
- **Agendamentos**: O registro das visitas marcadas, vinculando as três entidades acima.

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | LTS | Ambiente de execução JavaScript no servidor |
| Express | v5 | Framework web para criação de rotas e API REST |
| Sequelize | v6 | ORM (Object-Relational Mapper) para gerenciar o banco de dados |
| MySQL2 | v3 | Driver de conexão com o banco de dados MySQL |
| CORS | v2 | Permite que o frontend acesse a API de outra origem |
| Dotenv | v17 | Carrega as variáveis de ambiente do arquivo `.env` |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | v19 | Biblioteca JavaScript para construção de interfaces de usuário |
| Vite | v8 | Ferramenta de build e servidor de desenvolvimento ultrarrápido |
| React Router DOM | v7 | Gerencia a navegação entre as páginas da SPA |
| Axios | v1 | Faz as requisições HTTP para a API backend |
| React Hook Form | v7 | Gerencia o estado e validação dos formulários de forma eficiente |
| React Toastify | v11 | Exibe notificações (alerts) estilizadas para o usuário |
| Yup | v1 | Biblioteca de validação de esquemas para os formulários |

---

## 📁 Estrutura de Pastas

```
Projeto-agendamento-API/
│
├── back_and/                  # Pasta do Backend (API REST)
│   ├── scr/
│   │   └── index.js           # Arquivo principal: contém toda a lógica do servidor,
│   │                          #   a conexão com o banco, os Models e as Rotas (endpoints)
│   ├── .env                   # Variáveis de ambiente (credenciais do banco de dados)
│   ├── package.json           # Dependências e scripts do backend
│   └── package-lock.json
│
├── front_end/                 # Pasta do Frontend (React + Vite)
│   ├── public/
│   │   └── favicon.svg        # Ícone do navegador
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis de UI
│   │   │   ├── Header/
│   │   │   │   ├── index.jsx  # Cabeçalho com navegação (links para as rotas)
│   │   │   │   └── style.css  # Estilos do Header
│   │   │   └── Footer/
│   │   │       ├── index.jsx  # Rodapé da aplicação
│   │   │       └── style.css  # Estilos do Footer
│   │   ├── Pages/             # Telas completas da aplicação
│   │   │   ├── HomePage/
│   │   │   │   └── index.jsx  # Dashboard: exibe totais em cards (clientes, agendamentos...)
│   │   │   ├── ClientesPage/
│   │   │   │   ├── index.jsx  # Formulário de cadastro + Tabela listando clientes
│   │   │   │   └── style.css  # Estilos compartilhados (formulários e tabelas)
│   │   │   └── AgendamentosPage/
│   │   │       └── index.jsx  # Formulário de agendamento + Tabela com agendamentos
│   │   ├── services/
│   │   │   └── api.js         # Configuração do Axios: define a URL base da API
│   │   ├── App.jsx            # Componente raiz: configura as rotas e o layout geral
│   │   ├── index.css          # Estilos globais da aplicação
│   │   └── main.jsx           # Ponto de entrada do React (monta o App no HTML)
│   ├── index.html             # HTML principal (contém a div #root onde o React é montado)
│   ├── vite.config.js         # Configuração do servidor de desenvolvimento Vite
│   └── package.json           # Dependências e scripts do frontend
│
└── README.md                  # Esta documentação
```

---

## ⚙️ Como o Projeto Funciona

O projeto é dividido em duas partes independentes que se comunicam através de uma API REST.

### Fluxo Geral

```
[Usuário no Navegador]
        │
        │  acessa http://localhost:5173
        ▼
[Frontend — React/Vite (porta 5173)]
        │
        │  faz requisições HTTP (GET, POST) via Axios
        │  ex: GET http://localhost:3000/clientes
        ▼
[Backend — Node.js/Express (porta 3000)]
        │
        │  recebe a requisição, consulta o banco de dados via Sequelize
        ▼
[Banco de Dados — MySQL]
        │
        │  retorna os dados em formato JSON
        ▼
[Backend devolve o JSON para o Frontend]
        │
        ▼
[Frontend atualiza a tela com os dados recebidos]
```

### Passo a Passo Detalhado

1. O usuário acessa `http://localhost:5173` no navegador.
2. O Vite serve o arquivo `index.html`, que carrega o React via `main.jsx`.
3. O React monta o componente `App.jsx`, que renderiza o `Header` (menu de navegação) e define as rotas (`/`, `/clientes`, `/agendamentos`).
4. Quando o usuário navega para `/clientes`, o React renderiza o componente `ClientesPage` **sem recarregar a página** (isso é o React Router fazendo o seu trabalho).
5. O componente `ClientesPage` tem um `useEffect` que, ao ser montado, chama a função `carregarClientes()`.
6. Essa função usa o `Axios` (configurado em `services/api.js`) para fazer uma requisição `GET` para `http://localhost:3000/clientes`.
7. O servidor Node.js recebe a requisição na rota `app.get('/clientes', ...)` e instrui o Sequelize a executar um `SELECT * FROM Clientes`.
8. O banco de dados MySQL retorna os registros, o Sequelize os transforma em objetos JavaScript, e o Express os envia de volta como JSON.
9. O Axios recebe o JSON e atualiza o state (`setClientes(response.data)`) do componente React.
10. O React detecta a mudança no state e re-renderiza a tabela na tela com os dados recebidos.

---

## 🗃️ Banco de Dados

O banco de dados é gerenciado pelo **Sequelize**, que cria e mantém as tabelas automaticamente usando o comando `sequelize.sync()`.

### Diagrama de Entidades e Relacionamentos

```
Clientes (1) ─────────────────────────────────── (N) Agendamentos
Profissionais (1) ──────────────────────────────── (N) Agendamentos
Servicos (1) ──────────────────────────────────── (N) Agendamentos
```

### Tabela: `Clientes`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INTEGER | ✅ (auto) | Chave primária, gerada automaticamente |
| nome | VARCHAR | ✅ | Nome completo do cliente |
| email | VARCHAR | ✅ (único) | E-mail do cliente, não pode se repetir |
| telefone | VARCHAR | ❌ | Telefone de contato |
| createdAt | DATETIME | ✅ (auto) | Data de criação, gerada automaticamente |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização, gerada automaticamente |

### Tabela: `Profissionais`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INTEGER | ✅ (auto) | Chave primária |
| nome | VARCHAR | ✅ | Nome do profissional/arquiteto |
| especialidade | VARCHAR | ✅ | Área de atuação (ex: Interiores, Obras) |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `Servicos`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INTEGER | ✅ (auto) | Chave primária |
| nome | VARCHAR | ✅ | Nome do serviço |
| descricao | TEXT | ❌ | Descrição detalhada |
| preco | DECIMAL(10,2) | ✅ | Preço do serviço |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `Agendamentos`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INTEGER | ✅ (auto) | Chave primária |
| data | DATETIME | ✅ | Data e hora da visita agendada |
| status | VARCHAR | ❌ | Estado: `pendente`, `confirmado` ou `cancelado` (padrão: `pendente`) |
| ClienteId | INTEGER | ✅ | Chave estrangeira → `Clientes.id` |
| ProfissionalId | INTEGER | ✅ | Chave estrangeira → `Profissionais.id` |
| ServicoId | INTEGER | ✅ | Chave estrangeira → `Servicos.id` |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

> **Nota:** As colunas `id`, `createdAt` e `updatedAt` são criadas e gerenciadas automaticamente pelo Sequelize. As chaves estrangeiras (`ClienteId`, `ProfissionalId`, `ServicoId`) são geradas pelos relacionamentos definidos no código.

---

## 🔗 API REST — Endpoints

O backend roda na porta `3000` e expõe os seguintes endpoints:

### Clientes
| Método | Rota | Descrição | Body (JSON) |
|---|---|---|---|
| `GET` | `/clientes` | Retorna a lista de todos os clientes | — |
| `POST` | `/clientes` | Cadastra um novo cliente | `{ "nome": "", "email": "", "telefone": "" }` |

### Profissionais
| Método | Rota | Descrição | Body (JSON) |
|---|---|---|---|
| `GET` | `/profissionais` | Retorna a lista de todos os profissionais | — |
| `POST` | `/profissionais` | Cadastra um novo profissional | `{ "nome": "", "especialidade": "" }` |

### Serviços
| Método | Rota | Descrição | Body (JSON) |
|---|---|---|---|
| `GET` | `/servicos` | Retorna o catálogo de serviços | — |
| `POST` | `/servicos` | Cadastra um novo serviço | `{ "nome": "", "descricao": "", "preco": 0.00 }` |

### Agendamentos
| Método | Rota | Descrição | Body (JSON) |
|---|---|---|---|
| `GET` | `/agendamentos` | Retorna todos os agendamentos com dados de Cliente, Profissional e Serviço incluídos | — |
| `POST` | `/agendamentos` | Cria um novo agendamento | `{ "data": "2026-01-01T10:00", "status": "pendente", "ClienteId": 1, "ProfissionalId": 1, "ServicoId": 1 }` |

---

## 🖥️ Frontend — Telas e Componentes

### Componentes Reutilizáveis (`src/components/`)

#### `Header` (`components/Header/index.jsx`)
O cabeçalho aparece no topo de todas as páginas. Contém o nome "AgendaFácil" à esquerda e os links de navegação à direita: **Dashboard**, **Clientes** e **Agendamentos**. Usa o componente `NavLink` do React Router DOM para destacar automaticamente o link da página ativa.

#### `Footer` (`components/Footer/index.jsx`)
Rodapé simples exibido na base de todas as páginas com informações de copyright.

### Configuração de Rotas (`src/App.jsx`)
O arquivo `App.jsx` é o coração do frontend. Ele:
1. Envolve toda a aplicação no `BrowserRouter` (do React Router DOM).
2. Define o layout geral: `<Header>` → `<main>` com as rotas → `<Footer>`.
3. Mapeia cada URL para o componente de página correspondente:
   - `/` → `<HomePage />`
   - `/clientes` → `<ClientesPage />`
   - `/agendamentos` → `<AgendamentosPage />`

### Serviço de API (`src/services/api.js`)
Instância configurada do Axios com a URL base do backend (`http://localhost:3000`). Todos os componentes importam este arquivo para fazer as requisições, garantindo que a URL da API fique em um lugar centralizado.

### Páginas (`src/Pages/`)

#### `HomePage` (Dashboard — rota `/`)
Exibe um painel de controle com 4 cards informativos:
- Total de Clientes cadastrados
- Total de Profissionais cadastrados
- Total de Serviços cadastrados
- Total de Agendamentos registrados

Ao ser renderizada, a página dispara 4 requisições `GET` simultâneas para a API (usando `Promise.all` para eficiência) e exibe os totais nos cards.

#### `ClientesPage` (rota `/clientes`)
Dividida em duas seções:
1. **Formulário de Cadastro**: Campos de Nome, E-mail e Telefone. Gerenciado pelo `react-hook-form`. Ao submeter, faz um `POST /clientes` e recarrega a lista automaticamente.
2. **Tabela de Clientes**: Lista todos os clientes em uma tabela com colunas ID, Nome, Email e Telefone. Puxada via `GET /clientes` ao carregar a página.

#### `AgendamentosPage` (rota `/agendamentos`)
Dividida em duas seções:
1. **Formulário de Agendamento**: Ao carregar, busca dados de Clientes, Profissionais e Serviços para popular os `<select>` (dropdowns). O usuário escolhe o cliente, o profissional, o serviço, a data/hora e o status. Ao submeter, faz um `POST /agendamentos`.
2. **Tabela de Agendamentos**: Lista todos os agendamentos com as informações de cliente, profissional e serviço já expandidas (não mostra apenas o ID, mas o nome real de cada um).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada)
- [MySQL](https://dev.mysql.com/downloads/mysql/) rodando localmente
- Um banco de dados criado no MySQL (ex: `mydb`)

### Passo 1 — Configurar o Backend

```bash
# Entrar na pasta do backend
cd back_and

# Instalar as dependências
npm install

# Criar o arquivo de variáveis de ambiente (veja a seção abaixo)
# Edite o arquivo .env com as suas credenciais do MySQL

# Rodar o servidor em modo desenvolvimento (com auto-reload)
npm run dev
```

O backend estará disponível em: **http://localhost:3000**

Ao iniciar, o Sequelize irá automaticamente criar as tabelas no banco de dados se elas ainda não existirem.

### Passo 2 — Configurar o Frontend

```bash
# Em um novo terminal, entrar na pasta do frontend
cd front_end

# Instalar as dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## 🔑 Variáveis de Ambiente

Crie (ou edite) o arquivo `.env` dentro da pasta `back_and/` com as seguintes variáveis:

```env
# Host do banco de dados (normalmente localhost para desenvolvimento local)
DB_HOST=localhost

# Usuário do MySQL
DB_USER=root

# Senha do MySQL (deixe em branco se não tiver senha)
DB_PASSWORD=sua_senha

# Nome do banco de dados criado no MySQL
DB_DATABASE=mydb

# Porta em que o servidor Node.js irá rodar
PORT=3000
```

> ⚠️ **Importante**: O arquivo `.env` está listado no `.gitignore` e **não deve ser enviado para o GitHub**, pois contém credenciais sensíveis.

---

Desenvolvido como parte do projeto interdisciplinar SENAI.
