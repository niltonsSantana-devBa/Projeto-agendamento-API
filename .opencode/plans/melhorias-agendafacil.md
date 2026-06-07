# 🏛️ Plano de Melhorias - AgendaFácil

> **Status:** ⏳ Planejado  
> **Versão do Projeto:** v3 (React + Sequelize)  
> **Data:** 30/05/2026

---

## 🔴 PRIORIDADE ALTA (bugs visíveis)

### 1. Corrigir `<title>` do site
- **Arquivo:** `front_end/index.html:7`
- **Atual:** `<title>front_end</title>`
- **Novo:** `<title>AgendaFácil | Clínica de Arquitetura</title>`
- **Impacto:** Aparece na aba do navegador e no SEO

### 2. Corrigir `lang` do HTML
- **Arquivo:** `front_end/index.html:2`
- **Atual:** `<html lang="en">`
- **Novo:** `<html lang="pt-BR">`
- **Impacto:** Leitores de tela, navegadores, SEO

### 3. Adicionar Google Fonts (Inter)
- **Arquivo:** `front_end/index.html` (dentro de `<head>`)
- **Adicionar:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  ```
- **Impacto:** A fonte `Inter` usada no CSS (`front_end/src/index.css:4`) realmente carrega

---

## 🟡 PRIORIDADE MÉDIA (qualidade)

### 4. Ativar middleware `helmet`
- **Arquivo:** `back_and/scr/index.js`
- **Adicionar após `require('cors')`:**
  ```js
  const helmet = require('helmet');
  ```
- **Adicionar após `app.use(cors())`:**
  ```js
  app.use(helmet());
  ```
- **Impacto:** Segurança HTTP (headers, XSS, clickjacking) — pacote já instalado mas não usado

### 5. Substituir `alert()` por `react-toastify`
- **Arquivos envolvidos:**
  - `front_end/src/Pages/ClientesPage/index.jsx`
  - `front_end/src/Pages/AgendamentosPage/index.jsx`

- **Alterações:**
  ```jsx
  // 1. Importar no topo do arquivo
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  // 2. Substituir alert() por toast
  // ANTES:
  alert("Erro ao cadastrar. O email já pode existir.");
  // DEPOIS:
  toast.error("Erro ao cadastrar. O email já pode existir.");

  // 3. Adicionar <ToastContainer /> no return
  ```
- **Impacto:** Experiência do usuário muito melhor (notificações estilizadas)
- **Obs:** Biblioteca `react-toastify` já está no `package.json`

### 6. CSS próprio para AgendamentosPage
- **Arquivo:** `front_end/src/Pages/AgendamentosPage/index.jsx:4`
- **Atual:** `import '../ClientesPage/style.css';`
- **Novo:** Criar `front_end/src/Pages/AgendamentosPage/style.css` e importar dele
- **Impacto:** Desacopla as páginas, evita quebra futura

### 7. Versionar banco de dados (schema.sql + seed.sql)
- **Novo arquivo:** `database/schema.sql`
- **Novo arquivo:** `database/seed.sql`

```
Projeto-agendamento-API/
  ├── database/
  │   ├── schema.sql    ← CREATE TABLEs de todas as tabelas
  │   └── seed.sql      ← INSERTs com dados de exemplo
```

- **Impacto:** Permite recriar o banco do zero, versionado no Git

---

## 🟢 PRIORIDADE BAIXA (evolução)

### 8. Endpoints PUT e DELETE
- **Arquivo:** `back_and/scr/index.js`
- **Adicionar rotas:**
  ```js
  // Exemplo para Clientes
  app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const [updated] = await Cliente.update(req.body, { where: { id } });
    updated ? res.json({ mensagem: 'Atualizado' }) : res.status(404).json({ erro: 'Não encontrado' });
  });

  app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Cliente.destroy({ where: { id } });
    deleted ? res.json({ mensagem: 'Removido' }) : res.status(404).json({ erro: 'Não encontrado' });
  });
  ```
- **Repetir para:** Profissionais, Serviços, Agendamentos

### 9. Páginas de Profissionais e Serviços
- **Criar:**
  - `front_end/src/Pages/ProfissionaisPage/index.jsx` (seguir padrão ClientesPage)
  - `front_end/src/Pages/ServicosPage/index.jsx`
- **Atualizar:**
  - `front_end/src/App.jsx` (adicionar rotas)
  - `front_end/src/components/Header/index.jsx` (adicionar links no menu)

### 10. Validação no backend
- **Antes de `Model.create(req.body)`:** verificar campos obrigatórios
- **Exemplo:**
  ```js
  if (!req.body.nome || !req.body.email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }
  ```

### 11. Modularizar backend
- Separar `back_and/scr/index.js` em:
  ```
  back_and/
    ├── models/
    │   ├── Cliente.js
    │   ├── Profissional.js
    │   ├── Servico.js
    │   └── Agendamento.js
    ├── routes/
    │   ├── clienteRoutes.js
    │   ├── profissionalRoutes.js
    │   ├── servicoRoutes.js
    │   └── agendamentoRoutes.js
    ├── database.js       ← Configuração do Sequelize
    └── app.js            ← Servidor Express
  ```

---

## 📊 Resumo Visual

```
 BACKEND                          FRONTEND
 ┌─────────────────────┐          ┌──────────────────────┐
 │  scr/index.js       │          │  src/                │
 │                     │  HTTP    │  ├── App.jsx         │
 │  ✅ CORS           │◄────────►│  ├── Pages/           │
 │  ❌ helmet (não usa)│  REST   │  │  ├── HomePage ✅  │
 │  ✅ Sequelize ORM  │          │  │  ├── Clientes ✅  │
 │  ⚠️ 1 arquivo só   │          │  │  ├── Agendamentos✅│
 │  ❌ sem PUT/DELETE  │          │  │  └── Profissionais❌│
 │  ❌ sem validação   │          │  └── Servicos ❌     │
 └─────────────────────┘          └──────────────────────┘

 DATABASE                     GIT
 ┌────────────────┐          ┌────────────────┐
 │ MySQL - mydb   │          │ origin/main    │
 │ 4 tabelas ✅   │          │ 10 commits ✅  │
 │ sem dump SQL ❌│          │ .gitignore ✅  │
 └────────────────┘          └────────────────┘
```

---

## ✅ Checklist de Execução

- [ ] **#1** — Corrigir `<title>` no `index.html`
- [ ] **#2** — Corrigir `lang` no `index.html`
- [ ] **#3** — Adicionar Google Fonts no `index.html`
- [ ] **#4** — Ativar `helmet` no backend
- [ ] **#5** — Substituir `alert()` por `react-toastify`
- [ ] **#6** — Criar CSS próprio para AgendamentosPage
- [ ] **#7** — Criar `database/schema.sql` + `seed.sql`
- [ ] **#8** — Adicionar endpoints PUT/DELETE
- [ ] **#9** — Criar páginas de Profissionais e Serviços
- [ ] **#10** — Adicionar validação no backend
- [ ] **#11** — Modularizar backend em models/routes/controllers
- [ ] **📦** — `git add . && git commit -m "..." && git push`
