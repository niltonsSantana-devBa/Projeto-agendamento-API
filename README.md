# 🏛️ AgendaFácil — Sistema de Agendamento para Clínica de Arquitetura

**AgendaFácil** é uma aplicação web completa para gerenciamento de agendamentos em escritórios e clínicas de arquitetura. O sistema permite cadastrar clientes, profissionais (arquitetos), serviços oferecidos e as visitas agendadas (seja online, no escritório ou na obra), com interface moderna e banco de dados relacional.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
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

O AgendaFácil foi desenvolvido como um sistema fullstack com separação clara entre frontend (interface) e backend (API). A aplicação segue o modelo de Single Page Application (SPA) no frontend, onde a navegação acontece sem recarregar a página, e uma API RESTful no backend que se comunica com um banco de dados MySQL usando mysql2 puro.

O sistema é voltado para escritórios de arquitetura que precisam gerenciar:
- **Clientes**: Quem solicita os serviços (não precisam de conta).
- **Profissionais (Arquitetos)**: Os arquitetos responsáveis pelas visitas.
- **Serviços**: O catálogo de serviços oferecidos (cada serviço pertence a um profissional).
- **Agendamentos**: O registro das visitas marcadas, vinculando cliente e serviço (o profissional é definido pelo serviço).
- **Usuários**: Contas de acesso para **administradores** e **arquitetos** (autenticação JWT com perfis).

### 🌐 Fluxo Público (Cliente)

1. **Clientes** acessam `/arquitetos` para ver os profissionais e serviços disponíveis
2. Clicam em "Agendar" e são levados ao formulário em `/agendar`
3. Preenchem dados pessoais, escolhem profissional → serviço (filtrados) → data/hora
4. O sistema cria o cliente (se não existir) e registra o agendamento com status "pendente"
5. **Administradores** logam em `/login` e gerenciam os agendamentos via `/agenda` (visão diária)

### 🔐 Fluxo do Arquiteto (Auto-Cadastro)

1. O arquiteto acessa `/registrar-arquiteto` e preenche nome, email, senha e especialidade
2. O sistema cria uma conta de usuário com perfil `profissional` e um registro vinculado na tabela `profissionais`
3. O arquiteto é logado automaticamente e redirecionado para `/meus-servicos`
4. Em `/meus-servicos` ele gerencia (cria, edita, exclui) seus próprios serviços
5. Quando um cliente agenda um serviço desse arquiteto, ele pode consultar seus agendamentos via API (`GET /api/agendamentos/meus`) com nome, email e telefone do cliente para contato
6. Arquitetos também podem logar em `/login` com email e senha cadastrados

---

## ✨ Funcionalidades

### Para Clientes (sem login)
- **Vitrine de Arquitetos** (`/arquitetos`): visualizar profissionais e serviços disponíveis
- **Agendamento Online** (`/agendar`): preencher dados pessoais, escolher profissional e serviço, selecionar data/hora
- Agendamentos são criados com status "pendente" para aprovação do administrador

### Para Arquitetos (com auto-cadastro)
- **Auto-cadastro** (`/registrar-arquiteto`): criar conta com nome, email, senha e especialidade
- **Gerenciar Serviços** (`/meus-servicos`): criar, editar e excluir seus próprios serviços
- **Consultar Agendamentos** (via API): ver agendamentos recebidos com nome, email e telefone do cliente para contato

### Para Administradores (login protegido)
- **Dashboard** (`/`): visão geral com totais de clientes, profissionais, serviços e agendamentos
- **Agenda Diária** (`/agenda`): visualização dos agendamentos do dia com cards por status
- **CRUD Completo**: gerenciar clientes, profissionais, serviços e agendamentos
- **Confirmação/Cancelamento**: alterar status dos agendamentos diretamente pela interface

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | LTS | Ambiente de execução JavaScript no servidor |
| Express | v5 | Framework web para criação de rotas e API REST |
| MySQL2 | v3 | Driver de conexão com o banco de dados MySQL (com pool de conexões) |
| bcryptjs | v2 | Hash de senhas para autenticação |
| JSON Web Token | v9 | Tokens de autenticação JWT |
| CORS | v2 | Permite que o frontend acesse a API de outra origem |
| Helmet | v8 | Middleware de segurança HTTP (headers, XSS, clickjacking) |
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
├── database/                  # Scripts SQL do banco de dados
│   ├── schema.sql             # CREATE TABLE de todas as tabelas (compatível com Sequelize)
│   └── seed.sql               # Dados de exemplo para desenvolvimento
│
├── DEPLOY.md                  # Guia passo a passo para deploy na nuvem
│
├── back_and/                  # Pasta do Backend (API REST)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Pool de conexões mysql2
│   │   ├── controllers/
│   │   │   ├── clientes.controller.js
│   │   │   ├── profissionais.controller.js
│   │   │   ├── servicos.controller.js
│   │   │   ├── agendamentos.controller.js
│   │   │   └── auth.controller.js
│   │   ├── routes/
│   │   │   ├── clientes.routes.js
│   │   │   ├── profissionais.routes.js
│   │   │   ├── servicos.routes.js
│   │   │   ├── agendamentos.routes.js
│   │   │   └── auth.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # Verificação de token JWT
│   │   └── app.js                  # Configuração do Express + registro de rotas
│   ├── database/               # Scripts SQL
│   │   ├── schema.sql          # CREATE TABLE de todas as tabelas
│   │   └── seed.sql            # Dados de exemplo
│   ├── scripts/
│   │   └── init-db.js          # Script para recriar o banco do zero
│   ├── server.js               # Entry point (porta 3001)
│   ├── .env                    # Variáveis de ambiente
│   ├── package.json            # Dependências e scripts do backend
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
│   │   │   ├── AgendarPage/        # ★ PÁGINA PÚBLICA
│   │   │   │   └── index.jsx  # Formulário para cliente agendar online
│   │   │   ├── RegistrarArquitetoPage/ # ★ PÁGINA PÚBLICA
│   │   │   │   └── index.jsx  # Auto-cadastro de arquitetos
│   │   │   ├── MeusServicosPage/      # ★ PÁGINA DO ARQUITETO
│   │   │   │   └── index.jsx  # CRUD de serviços do arquiteto logado
│   │   │   ├── ArquitetosPage/    # ★ PÁGINA PÚBLICA
│   │   │   │   └── index.jsx  # Vitrine de arquitetos e serviços
│   │   │   ├── ClientesPage/
│   │   │   │   ├── index.jsx  # Formulário de cadastro + Tabela listando clientes
│   │   │   │   └── style.css  # Estilos compartilhados (formulários e tabelas)
│   │   │   ├── ProfissionaisPage/
│   │   │   │   └── index.jsx  # Formulário de cadastro + Tabela de profissionais
│   │   │   ├── ServicosPage/
│   │   │   │   └── index.jsx  # Formulário de cadastro + Tabela de serviços
│   │   │   └── AgendamentosPage/
│   │   │       ├── index.jsx  # Formulário de agendamento + Tabela com agendamentos
│   │   │       └── style.css  # Estilos próprios da página
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
        │  faz requisições HTTP (GET, POST, PUT, DELETE) via Axios
        │  ex: GET http://localhost:3001/api/clientes
        ▼
[Backend — Node.js/Express (porta 3001)]
        │
        │  recebe a requisição, consulta o banco de dados via mysql2 (pool)
        ▼
[Banco de Dados — MySQL (porta 3306)]
        │
        │  retorna os dados em formato JSON
        ▼
[Backend devolve o JSON para o Frontend]
        │
        ▼
[Frontend atualiza a tela com os dados recebidos]
```

### Fluxo do Administrador (Painel Interno)

1. O administrador acessa `http://localhost:5173/login` e faz login com email + senha.
2. O backend valida as credenciais com bcrypt e retorna um token JWT contendo o perfil (`admin` ou `profissional`).
3. O frontend armazena o token no `localStorage` e o envia em todas as requisições autenticadas via header `Authorization: Bearer <token>`.
4. Dependendo do perfil:
   - **Admin**: navega pelas rotas protegidas (`/`, `/clientes`, `/profissionais`, `/servicos`, `/agenda`, `/agendamentos`).
   - **Arquiteto**: redirecionado para `/meus-servicos` onde gerencia seus próprios serviços.
5. Cada página carrega dados da API via `useEffect` + `Axios` (com token JWT automático via interceptor).
6. Se o token expirar ou for inválido (status 401), o interceptor do Axios limpa o localStorage e redireciona para `/login`.

### Fluxo Público (Cliente)

1. O cliente acessa `http://localhost:5173/arquitetos` e vê a vitrine de arquitetos com seus serviços.
2. Clica em **"Agendar"** em um serviço, que o leva para `/agendar?profissional=X` (pré-seleciona o profissional).
3. No formulário, preenche nome, email, telefone e seleciona:
   - Profissional (carrega serviços disponíveis)
   - Serviço (filtrado pelo profissional selecionado — cascade select)
   - Data e hora
4. O frontend busca o cliente pelo email (`GET /clientes/email/:email`):
   - Se não existir, cria um novo cliente (`POST /clientes`)
5. Cria o agendamento com status "pendente" (`POST /agendamentos`, sem `profissional_id` — o profissional é determinado pelo serviço).
6. O administrador vê o novo agendamento na página `/agenda` (visão diária) ou `/agendamentos` (lista completa) e pode confirmar ou cancelar.

---

## 🗃️ Banco de Dados

O banco de dados MySQL possui 5 tabelas. O schema é gerenciado manualmente via scripts SQL (`back_and/database/schema.sql`).

### Diagrama de Entidades e Relacionamentos

```
usuarios (1) ─────────────── (1) profissionais
profissionais (1) ────────── (N) servicos
clientes (1) ─────────────── (N) agendamentos
servicos (1) ─────────────── (N) agendamentos
```

> **Nota:** O relacionamento `profissionais ↔ agendamentos` é indireto através de `servicos` (cada serviço pertence a um profissional). A tabela `usuarios` armazena as credenciais de login; profissionais podem ter uma conta vinculada (`usuario_id`) para acessar o sistema.

### Tabela: `profissionais`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INT | ✅ (auto) | Chave primária |
| nome | VARCHAR(255) | ✅ | Nome do profissional |
| especialidade | VARCHAR(255) | ✅ | Área de atuação |
| telefone | VARCHAR(50) | ❌ | Telefone de contato |
| ativo | TINYINT(1) | ❌ | Se o profissional está ativo (1=sim, 0=não) |
| usuario_id | INT | ❌ (único) | FK → usuarios.id (vincula conta de login) |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `servicos`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INT | ✅ (auto) | Chave primária |
| nome | VARCHAR(255) | ✅ | Nome do serviço |
| descricao | TEXT | ❌ | Descrição detalhada |
| preco | DECIMAL(10,2) | ✅ | Preço do serviço |
| duracao_min | INT | ✅ | Duração em minutos (padrão: 60) |
| profissional_id | INT | ✅ | FK → profissionais.id |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `clientes`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INT | ✅ (auto) | Chave primária |
| nome | VARCHAR(255) | ✅ | Nome completo |
| email | VARCHAR(255) | ✅ (único) | E-mail do cliente |
| telefone | VARCHAR(50) | ❌ | Telefone de contato |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `agendamentos`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INT | ✅ (auto) | Chave primária |
| cliente_id | INT | ✅ | FK → clientes.id |
| servico_id | INT | ✅ | FK → servicos.id |
| data_hora | DATETIME | ✅ | Data e hora do agendamento |
| status | VARCHAR(50) | ❌ | `pendente`, `confirmado` ou `cancelado` (padrão: `pendente`) |
| observacao | TEXT | ❌ | Observações opcionais |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

### Tabela: `usuarios`
| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | INT | ✅ (auto) | Chave primária |
| nome | VARCHAR(255) | ✅ | Nome do usuário |
| email | VARCHAR(255) | ✅ (único) | E-mail para login |
| senha_hash | VARCHAR(255) | ✅ | Hash bcrypt da senha |
| perfil | ENUM('admin','profissional') | ✅ | Nível de acesso |
| createdAt | DATETIME | ✅ (auto) | Data de criação |
| updatedAt | DATETIME | ✅ (auto) | Data de atualização |

---

## 🔗 API REST — Endpoints

O backend roda na porta `3001` e expõe os seguintes endpoints (prefixo `/api`):

### Autenticação
| Método | Rota | Descrição | Body (JSON) | Auth |
|--------|------|-----------|-------------|------|
| `POST` | `/api/login` | Autentica e retorna JWT (admin ou profissional) | `{ "email": "", "senha": "" }` | ❌ |
| `POST` | `/api/register/profissional` | Auto-cadastro de arquiteto (cria usuário + profissional) | `{ "nome", "email", "senha", "especialidade", "telefone?" }` | ❌ |

### Clientes
| Método | Rota | Descrição | Body (JSON) | Auth |
|--------|------|-----------|-------------|------|
| `GET` | `/api/clientes` | Lista todos os clientes | — | ✅ |
| `GET` | `/api/clientes/email/:email` | Busca cliente por e-mail | — | ❌ |
| `POST` | `/api/clientes` | Cadastra novo cliente | `{ "nome", "email", "telefone" }` | ❌ |
| `PUT` | `/api/clientes/:id` | Atualiza cliente | `{ "nome", "email", "telefone" }` | ❌ |
| `DELETE` | `/api/clientes/:id` | Remove cliente | — | ✅ |

### Profissionais
| Método | Rota | Descrição | Body (JSON) | Auth |
|--------|------|-----------|-------------|------|
| `GET` | `/api/profissionais` | Lista profissionais | — | ❌ |
| `POST` | `/api/profissionais` | Cadastra profissional | `{ "nome", "especialidade", "telefone", "ativo" }` | ✅ |
| `PUT` | `/api/profissionais/:id` | Atualiza profissional | — | ✅ |
| `DELETE` | `/api/profissionais/:id` | Remove profissional | — | ✅ |

### Serviços
| Método | Rota | Descrição | Body (JSON) | Auth |
|--------|------|-----------|-------------|------|
| `GET` | `/api/servicos` | Lista serviços (com nome do profissional via JOIN) | — | ❌ |
| `GET` | `/api/servicos/profissional/:id` | Lista serviços de um profissional | — | ❌ |
| `GET` | `/api/servicos/meus` | Lista serviços do arquiteto logado (filtrado pelo token) | — | ✅ |
| `POST` | `/api/servicos` | Cadastra serviço | `{ "nome", "descricao", "preco", "duracao_min", "profissional_id" }` | ✅ |
| `PUT` | `/api/servicos/:id` | Atualiza serviço | — | ✅ |
| `DELETE` | `/api/servicos/:id` | Remove serviço | — | ✅ |

### Agendamentos
| Método | Rota | Descrição | Body (JSON) | Auth |
|--------|------|-----------|-------------|------|
| `GET` | `/api/agendamentos` | Lista agendamentos (com dados completos via JOIN) | — | ✅ |
| `GET` | `/api/agendamentos?data=2026-05-30` | Filtra agendamentos por data | — | ✅ |
| `GET` | `/api/agendamentos/meus` | Lista agendamentos do arquiteto logado (com nome/email/telefone do cliente) | — | ✅ |
| `POST` | `/api/agendamentos` | Cria agendamento | `{ "data_hora", "cliente_id", "servico_id", "status", "observacao" }` | ❌ |
| `PUT` | `/api/agendamentos/:id` | Atualiza agendamento | — | ✅ |
| `DELETE` | `/api/agendamentos/:id` | Remove agendamento | — | ✅ |

> **Nota:** O profissional é determinado através do serviço (relacionamento `servicos.profissional_id`). O endpoint `GET /api/agendamentos/meus` retorna os dados de contato do cliente (`cliente_nome`, `cliente_email`, `cliente_telefone`) para que o arquiteto possa entrar em contato.

---

## 🖥️ Frontend — Telas e Componentes

### Componentes Reutilizáveis (`src/components/`)

#### `Header` (`components/Header/index.jsx`)
O cabeçalho aparece no topo de todas as páginas. Contém o nome "AgendaFácil" à esquerda e os links de navegação à direita. O Header é sensível ao estado de autenticação e ao perfil do usuário:

- **Visitante (não logado):** Arquitetos, Agendar, Cadastre-se, Login
- **Arquiteto (logado):** Arquitetos, Agendar, Meus Serviços, [nome] + Sair
- **Administrador (logado):** Arquitetos, Agendar, Dashboard, Agenda, Clientes, Profissionais, Serviços, Agendamentos, [nome] + Sair

Usa o componente `NavLink` do React Router DOM para destacar automaticamente o link da página ativa. O Header escuta o evento customizado `login` (disparado pelo LoginPage e RegistrarArquitetoPage) para atualizar os links sem recarregar a página.

#### `Footer` (`components/Footer/index.jsx`)
Rodapé simples exibido na base de todas as páginas com informações de copyright.

### Configuração de Rotas (`src/App.jsx`)
O arquivo `App.jsx` é o coração do frontend. Ele:
1. Envolve toda a aplicação no `BrowserRouter` (do React Router DOM).
2. Define o layout geral: `<Header>` → `<main>` com as rotas → `<Footer>`.
3. Mapeia cada URL para o componente de página correspondente. Rotas autenticadas são protegidas por `<PrivateRoute>` (verifica token JWT no localStorage):
   - `/` → `<HomePage />` (autenticado — admin)
   - `/arquitetos` → `<ArquitetosPage />` (público)
   - `/agendar` → `<AgendarPage />` (público)
   - `/registrar-arquiteto` → `<RegistrarArquitetoPage />` (público)
   - `/login` → `<LoginPage />` (público)
   - `/meus-servicos` → `<MeusServicosPage />` (autenticado — arquiteto)
   - `/agenda` → `<AgendaPage />` (autenticado — admin)
   - `/clientes` → `<ClientesPage />` (autenticado — admin)
   - `/profissionais` → `<ProfissionaisPage />` (autenticado — admin)
   - `/servicos` → `<ServicosPage />` (autenticado — admin)
   - `/agendamentos` → `<AgendamentosPage />` (autenticado — admin)

### Serviço de API (`src/services/api.js`)
Instância configurada do Axios com a URL base do backend (`http://localhost:3001/api`). Também possui:
- **Interceptor de requisição**: adiciona automaticamente o header `Authorization: Bearer <token>` em todas as requisições (se o token existir no localStorage)
- **Interceptor de resposta**: se receber status 401 (não autorizado), limpa o localStorage e redireciona para `/login`
- O prefixo `/api` já está na baseURL, então os componentes usam apenas o path relativo (ex: `api.get('/clientes')`)

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

#### `ProfissionaisPage` (rota `/profissionais`)
Dividida em duas seções:
1. **Formulário de Cadastro**: Campos de Nome e Especialidade. Ao submeter, faz um `POST /profissionais` e recarrega a lista.
2. **Tabela de Profissionais**: Lista todos os profissionais cadastrados com colunas ID, Nome e Especialidade.

#### `ServicosPage` (rota `/servicos`)
Dividida em duas seções:
1. **Formulário de Cadastro**: Campos de Nome, Descrição e Preço. Ao submeter, faz um `POST /servicos` e recarrega a lista.
2. **Tabela de Serviços**: Lista todos os serviços cadastrados com colunas ID, Nome, Descrição e Preço.

#### `LoginPage` (rota `/login`) — Página Pública
Formulário de autenticação com email e senha. Ao fazer login:
1. Envia `POST /api/login` com email e senha
2. Recebe um token JWT contendo id, nome, email e perfil (`admin` ou `profissional`) e, se for profissional, o `profissionalId` vinculado
3. Armazena token e dados do usuário no `localStorage`
4. Redireciona conforme o perfil:
   - **Admin** → Dashboard (`/`)
   - **Arquiteto** → Meus Serviços (`/meus-servicos`)
5. Dispara evento `login` que o Header escuta para atualizar a navegação
6. Exibe link "É arquiteto? Cadastre-se" para novos arquitetos

#### `RegistrarArquitetoPage` (rota `/registrar-arquiteto`) — Página Pública
Formulário de auto-cadastro para arquitetos. Campos: Nome, Email, Senha (mín. 6 caracteres), Especialidade e Telefone (opcional). Ao submeter:
1. Envia `POST /api/register/profissional` com todos os dados
2. O backend cria um registro em `usuarios` (perfil `profissional`) e um registro vinculado em `profissionais` com o `usuario_id`
3. Retorna token JWT e dados do usuário (incluindo `profissionalId`)
4. Armazena token e dados no `localStorage`, dispara evento `login` e redireciona para `/meus-servicos`
5. Exibe link "Já tem conta? Faça login"

#### `MeusServicosPage` (rota `/meus-servicos`) — Página Autenticada (Arquiteto)
Painel do arquiteto para gerenciar seus próprios serviços. Funcionalidades:
- **Formulário**: cadastra novo serviço com Nome, Descrição, Preço e Duração (minutos)
- **Listagem**: exibe todos os serviços do arquiteto logado em cards
- **Edição**: clica em "Editar" no card para preencher o formulário com os dados do serviço
- **Exclusão**: clica em "Excluir" com confirmação via `window.confirm`
- Os dados são carregados via `GET /api/servicos/meus` (filtrado pelo token JWT — apenas serviços onde `profissionais.usuario_id` coincide com o usuário logado)

#### `AgendaPage` (rota `/agenda`) — Página Administrativa
Visualização dos agendamentos do dia com filtro por data. Funcionalidades:
- Input de data para selecionar o dia
- Cards coloridos por status (verde=confirmado, vermelho=cancelado, amarelo=pendente)
- Botões para confirmar ou cancelar agendamentos diretamente
- Dados carregados via `GET /api/agendamentos?data=YYYY-MM-DD`
- Atualização de status via `PUT /api/agendamentos/:id`

#### `ArquitetosPage` (rota `/arquitetos`) — Página Pública
Vitrine pública que lista todos os arquitetos (profissionais) cadastrados, exibindo seus nomes e especialidades. Abaixo de cada arquiteto, mostra os serviços disponíveis. Cada serviço tem um botão **"Agendar"** que leva o cliente direto para `/agendar?profissionalId=X&servicoId=Y`, pré-selecionando o arquiteto e o serviço.

Funcionamento:
1. Ao carregar, faz `GET /profissionais` e `GET /servicos` em paralelo.
2. Filtra os serviços de cada profissional e exibe em cards.
3. O botão "Agendar" usa `useSearchParams` para passar os IDs na URL.

#### `AgendarPage` (rota `/agendar`) — Página Pública
Formulário público para clientes agendarem uma visita. O cliente preenche:
- **Nome**, **Email**, **Telefone**
- **Profissional** (select populado via `GET /profissionais`)
- **Serviço** (select populado via `GET /servicos`)
- **Data e hora**

Se o usuário veio da página `/arquitetos`, os selects de profissional e serviço já vêm pré-selecionados.

Fluxo ao submeter:
1. Tenta buscar o cliente pelo email via `GET /clientes/email/:email`
2. Se não encontrar, cria um novo cliente com `POST /clientes`
3. Cria o agendamento com `POST /agendamentos` (status = "pendente")
4. Exibe toast de sucesso e limpa o formulário

#### `AgendamentosPage` (rota `/agendamentos`)
Dividida em duas seções:
1. **Formulário de Agendamento**: Ao carregar, busca dados de Clientes, Profissionais e Serviços para popular os `<select>` (dropdowns). O usuário escolhe o cliente, o profissional, o serviço, a data/hora e o status. Ao submeter, faz um `POST /agendamentos`.
2. **Tabela de Agendamentos**: Lista todos os agendamentos com as informações de cliente, profissional e serviço já expandidas (não mostra apenas o ID, mas o nome real de cada um). Os administradores podem ver os agendamentos criados pelo fluxo público e alterar o status para "confirmado" ou "cancelado".

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

# (Opcional) Recriar o banco de dados com a estrutura e dados de exemplo:
node scripts/init-db.js

# Rodar o servidor em modo desenvolvimento (com auto-reload)
npm run dev
```

O backend estará disponível em: **http://localhost:3001**

A API estará disponível em: **http://localhost:3001/api**

> ⚠️ A primeira vez que for rodar o projeto, execute `node scripts/init-db.js` para criar as tabelas e popular com dados de exemplo. O script recria o banco do zero (incluindo DROP DATABASE).

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
PORT=3001

# Origem permitida pelo CORS (separar múltiplas com vírgula, ex: http://localhost:5173,https://meusite.com)
CORS_ORIGIN=http://localhost:5173

# Chave secreta para assinar os tokens JWT
JWT_SECRET=agendafacil_super_secreto_2026
```

> ⚠️ **Importante**: O arquivo `.env` está listado no `.gitignore` e **não deve ser enviado para o GitHub**, pois contém credenciais sensíveis.

---

## ☁️ Deploy na Nuvem

O projeto está preparado para deploy em duas plataformas gratuitas:

### Railway (Backend + MySQL)

1. Crie uma conta em [railway.app](https://railway.app)
2. Clique em **New Project** → **Deploy from GitHub repo**
3. Selecione o repositório e a pasta `back_and/`
4. Railway detecta automaticamente Node.js e `npm start`
5. Adicione um banco MySQL: **New** → **Database** → **MySQL**
6. Nas variáveis de ambiente do backend, a Railway injeta automaticamente `DATABASE_URL` (o backend já está configurado para usá-la)
7. Após o deploy, o Railway fornece uma URL como `https://backend-production.up.railway.app`

### Vercel (Frontend)

1. Crie uma conta em [vercel.app](https://vercel.app)
2. Clique em **Add New** → **Project**
3. Importe o repositório GitHub
4. Configure:
   - **Root Directory:** `front_end`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Adicione a variável de ambiente:
   - `VITE_API_URL`: a URL do backend no Railway (ex: `https://backend-production.up.railway.app`)
6. Clique em **Deploy**

> O `vercel.json` já está configurado para roteamento SPA.

---

Desenvolvido como parte do projeto interdisciplinar SENAI.
