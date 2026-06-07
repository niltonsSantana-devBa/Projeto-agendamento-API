# 🏛️ Plano de Reestruturação Completa — AgendaFácil

> **Objetivo:** Adequar o projeto atual ao cronograma das disciplinas de Banco de Dados (Prof. Roberto) e Front-End (Prof. Carlos)
> **Nicho:** Arquitetura (mantido)
> **Estratégia:** Migrar de Sequelize para mysql2 puro + adicionar autenticação + novas páginas

---

## 📊 Visão Geral das Mudanças

```
ANTES (atual)                              DEPOIS (requisitado)
─────────────────────────────────────────────────────────────────
Backend:
  scr/index.js (1 arquivo, 235 linhas)     src/config/ + routes/ + controllers/ + middleware/
  Sequelize ORM                             mysql2 puro com pool
  Porta 3000                                Porta 3001
  Sem prefixo /api                          Rotas com /api/
  Sem autenticação                          JWT + bcrypt
  Sem tabela usuarios                       Tabela usuarios + login
  Sem FK profissional em servicos           servicos.profissional_id (1:N)

Frontend:
  7 páginas (Home, Arquitetos, Agendar,     9 páginas (adicionar Login + Agenda)
    Clientes, Profissionais, Servicos,
    Agendamentos)
  Sem login                                 Tela de login
  Sem agenda visual                         Agenda diária/semanal
  Tudo público                              Rotas protegidas para admin
```

---

## 📦 Fase 1 — Reestruturação do Backend (MVC + mysql2)

### O que muda
- O arquivo `back_and/scr/index.js` (235 linhas) será **substituído** por uma estrutura organizada em camadas
- Sequelize será **removido** — tudo com mysql2 puro (como o professor pede)
- Porta muda para **3001**

### Nova estrutura de pastas

```
back_and/
├── src/
│   ├── config/
│   │   └── database.js            ← Pool mysql2 (conexão reutilizável)
│   ├── routes/
│   │   ├── profissionais.routes.js
│   │   ├── servicos.routes.js
│   │   ├── clientes.routes.js
│   │   ├── agendamentos.routes.js
│   │   └── auth.routes.js
│   ├── controllers/
│   │   ├── profissionais.controller.js
│   │   ├── servicos.controller.js
│   │   ├── clientes.controller.js
│   │   ├── agendamentos.controller.js
│   │   └── auth.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js     ← Verificação do JWT
│   └── app.js                     ← Setup do Express + registro de rotas
├── database/
│   ├── schema.sql                 ← Schema atualizado (cópia dentro do backend)
│   └── seed.sql                   ← Dados de exemplo atualizados
├── server.js                      ← Entry point: importa app.js e sobe na porta 3001
├── .env
├── package.json
└── README.md
```

### Endpoints após a mudança

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | /api/profissionais | Listar profissionais | ❌ Público |
| GET | /api/servicos | Listar serviços | ❌ Público |
| GET | /api/clientes | Listar clientes | ✅ Admin |
| POST | /api/clientes | Cadastrar cliente (público + admin) | ❌ Público |
| GET | /api/clientes/email/:email | Buscar cliente por email | ❌ Público |
| GET | /api/agendamentos | Listar agendamentos | ✅ Admin |
| GET | /api/agendamentos?data=2026-05-30 | Agenda do dia | ✅ Admin |
| POST | /api/agendamentos | Criar agendamento | ❌ Público |
| PUT | /api/agendamentos/:id | Atualizar agendamento | ✅ Admin |
| DELETE | /api/agendamentos/:id | Cancelar agendamento | ✅ Admin |
| POST | /api/login | Autenticar usuário | ❌ Público |

### Arquivos a criar (12 arquivos)
1. `back_and/src/config/database.js` — Pool mysql2
2. `back_and/src/controllers/clientes.controller.js`
3. `back_and/src/controllers/profissionais.controller.js`
4. `back_and/src/controllers/servicos.controller.js`
5. `back_and/src/controllers/agendamentos.controller.js`
6. `back_and/src/controllers/auth.controller.js`
7. `back_and/src/routes/clientes.routes.js`
8. `back_and/src/routes/profissionais.routes.js`
9. `back_and/src/routes/servicos.routes.js`
10. `back_and/src/routes/agendamentos.routes.js`
11. `back_and/src/routes/auth.routes.js`
12. `back_and/src/middleware/auth.middleware.js`
13. `back_and/src/app.js` — Montagem do Express
14. `back_and/server.js` — Entry point

### Arquivos a modificar (3 arquivos)
- `back_and/package.json` — Remover sequelize, adicionar bcryptjs + jsonwebtoken
- `back_and/.env` — Adicionar JWT_SECRET, ajustar porta
- `back_and/database/schema.sql` — Atualizar com novas tabelas/colunas
- `back_and/database/seed.sql` — Atualizar seed

### Arquivos a deletar (1 arquivo)
- ~~`back_and/scr/index.js`~~ (substituído pelos novos arquivos)

### Dependências a instalar
```bash
npm uninstall sequelize
npm install bcryptjs jsonwebtoken
```

---

## 📦 Fase 2 — Banco de Dados (schema atualizado)

### Tabela: `usuarios` (NOVA)
| Coluna | Tipo | Restrições |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| senha_hash | VARCHAR(255) | NOT NULL |
| perfil | ENUM('admin','profissional') | NOT NULL, DEFAULT 'admin' |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

### Tabela: `servicos` (MODIFICADA — adicionar colunas)
| Coluna | Tipo | Restrições |
|--------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(255) | NOT NULL |
| descricao | TEXT | DEFAULT NULL |
| preco | DECIMAL(10,2) | NOT NULL |
| duracao_min | INT | NOT NULL, DEFAULT 60 |
| profissional_id | INT | FK → profissionais.id, NOT NULL |
| createdAt | DATETIME | NOT NULL |
| updatedAt | DATETIME | NOT NULL |

### Relacionamento novo
```
profissionais (1) ────────── (N) servicos
```
Cada serviço agora pertence a UM profissional específico.

### Arquivos a modificar
- `back_and/database/schema.sql` — Adicionar CREATE TABLE usuarios + ALTER TABLE servicos
- `back_and/database/seed.sql` — Adicionar INSERT usuarios + atualizar servicos

---

## 📦 Fase 3 — Autenticação (JWT + bcrypt)

### Fluxo de login
1. Admin acessa `/login` → preenche email + senha
2. Frontend faz `POST /api/login` com { email, senha }
3. Backend busca usuario por email, compara senha com bcrypt
4. Se ok, gera JWT com { id, nome, email, perfil } e retorna para o frontend
5. Frontend armazena token (localStorage) e envia em toda requisição admin via header `Authorization: Bearer <token>`

### Middleware de auth
- Verifica se o token JWT existe e é válido
- Se inválido/ausente → 401 Unauthorized
- Se válido → `req.usuario` com dados do usuário logado

### Rotas protegidas vs públicas
- **Públicas (sem token):** GET /api/profissionais, GET /api/servicos, POST /api/clientes, GET /api/clientes/email/:email, POST /api/agendamentos, POST /api/login
- **Privadas (requer token):** GET /api/clientes, GET /api/agendamentos, PUT /api/agendamentos/:id, DELETE /api/agendamentos/:id

### Arquivos a criar
1. `back_and/src/controllers/auth.controller.js`
2. `back_and/src/routes/auth.routes.js`
3. `back_and/src/middleware/auth.middleware.js`

---

## 📦 Fase 4 — Frontend (Login + Agenda + Ajustes)

### Novas páginas

#### 1. LoginPage (`/login`)
- Formulário com email + senha
- Ao logar, armazena token no localStorage
- Redireciona para Dashboard (`/`)
- Se já logado, esconde links de login

#### 2. AgendaPage (`/agenda`)
- Input de data (date picker)
- Ao selecionar data, faz `GET /api/agendamentos?data=YYYY-MM-DD`
- Exibe agendamentos do dia em formato de cards ou timeline
- Mostra: horário, cliente, profissional, serviço, status
- Apenas para admin (requer token)

### Arquivos a criar (frontend)
1. `front_end/src/Pages/LoginPage/index.jsx`
2. `front_end/src/Pages/AgendaPage/index.jsx`

### Arquivos a modificar (frontend)

#### `front_end/src/services/api.js`
```js
// Mudar porta para 3001, adicionar prefixo /api
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Adicionar interceptor para enviar token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### `front_end/src/App.jsx`
- Adicionar imports e rotas: `/login` → LoginPage, `/agenda` → AgendaPage
- Rotas protegidas: se não tiver token, redirecionar para `/login`

#### `front_end/src/components/Header/index.jsx`
- Adicionar link "Agenda" (admin)
- Adicionar link "Login" / "Logout" (se logado → mostrar nome + logout)
- Esconder links administrativos se não estiver logado

### Ajustes nas páginas existentes
- **ArquitetosPage** — manter, mas exibir serviços filtrados por profissional (aproveitar novo relacionamento)
- **AgendarPage** — manter, mas o select de serviço agora depende do profissional selecionado (cadeia)
- **ServicosPage** — ajustar para incluir campo `profissional_id` e `duracao_min`
- **AgendamentosPage** — ajustar chamadas para `/api/agendamentos?data=...`

---

## 📦 Fase 5 — Finalização

### O que fazer
1. Atualizar `front_end/index.html` — `<title>` e `lang` (pendente do plano anterior)
2. Atualizar `README.md` com nova estrutura e instruções
3. Testar fluxo completo:
   - Login admin → Dashboard → CRUD clientes/profissionais/servicos/agendamentos
   - Página pública → Arquitetos → Agendar → sucesso
   - Agenda diária → filtrar por data → visualizar
4. Commit e push

---

## 🔄 Sequência de Execução

```
Fase 1 ──► Fase 2 ──► Fase 3 ──► Fase 4 ──► Fase 5
  │            │            │            │
  │            ▼            │            │
  │    schema.sql +         │            │
  │    seed.sql             │            │
  │                         │            │
  ▼                         ▼            │
Backend MVC +              Auth +       Login +
mysql2 puro                JWT          Agenda
                                        pages
                                        │
                                        ▼
                                    Finalização
                                    (README + testes)
```

---

## ✅ Checklist Completo

### Fase 1 — Backend MVC
- [ ] Criar `src/config/database.js` (mysql2 pool)
- [ ] Criar `src/controllers/clientes.controller.js`
- [ ] Criar `src/controllers/profissionais.controller.js`
- [ ] Criar `src/controllers/servicos.controller.js`
- [ ] Criar `src/controllers/agendamentos.controller.js`
- [ ] Criar `src/routes/clientes.routes.js`
- [ ] Criar `src/routes/profissionais.routes.js`
- [ ] Criar `src/routes/servicos.routes.js`
- [ ] Criar `src/routes/agendamentos.routes.js`
- [ ] Criar `src/app.js` (montagem do Express)
- [ ] Criar `server.js` (entry point porta 3001)
- [ ] Deletar `scr/index.js` (antigo)
- [ ] Atualizar `package.json` (scripts: `start` → `node server.js`)
- [ ] Atualizar `.env` (PORT=3001)

### Fase 2 — Banco de Dados
- [ ] Atualizar `database/schema.sql` (add usuarios, profissional_id, duracao_min)
- [ ] Atualizar `database/seed.sql` (add usuario admin, servicos com profissional_id)
- [ ] Rodar schema.sql no MySQL para criar nova estrutura

### Fase 3 — Autenticação
- [ ] Instalar bcryptjs + jsonwebtoken
- [ ] Criar `src/controllers/auth.controller.js`
- [ ] Criar `src/routes/auth.routes.js`
- [ ] Criar `src/middleware/auth.middleware.js`
- [ ] Proteger rotas admin em `src/app.js`

### Fase 4 — Frontend
- [ ] Criar `LoginPage/index.jsx`
- [ ] Criar `AgendaPage/index.jsx`
- [ ] Modificar `services/api.js` (porta 3001 + prefixo /api + interceptor JWT)
- [ ] Modificar `App.jsx` (rotas + proteção)
- [ ] Modificar `Header/index.jsx` (Agenda + Login/Logout)
- [ ] Ajustar `ArquitetosPage` (servicos por profissional)
- [ ] Ajustar `AgendarPage` (selects em cadeia)
- [ ] Ajustar `ServicosPage` (novos campos)

### Fase 5 — Finalização
- [ ] Corrigir `<title>` e `lang` no `index.html`
- [ ] Atualizar `README.md`
- [ ] Testar fluxo completo
- [ ] `git add . && git commit -m "..." && git push`
