# 🚀 Guia de Deploy - AgendaFácil

## Passo 1 — Railway (Backend + Banco MySQL)

### 1.1 Criar conta
1. Acesse https://railway.app
2. Clique em **Sign Up** (GitHub, Google ou email)
3. Confirme seu email

### 1.2 Criar projeto
1. Clique em **New Project**
2. Escolha **Deploy from GitHub repo**
3. Autorize o Railway a acessar seu GitHub
4. Selecione o repositório `Projeto-agendamento-API`
5. Em **Root Directory**, digite: `back_and`
6. Clique em **Deploy**

### 1.3 Adicionar banco MySQL
1. Dentro do projeto, clique em **New**
2. Escolha **Database** → **MySQL**
3. Aguarde alguns segundos até o banco ficar verde (✅ Running)
4. O Railway vai injetar automaticamente a variável `DATABASE_URL` no backend

### 1.4 Obter URL do backend
1. No projeto Railway, clique no serviço do **Node.js** (não no MySQL)
2. Na aba **Settings**,role até **Domains**
3. Clique em **Generate Domain**
4. Copie a URL gerada (ex: `https://backend-production.up.railway.app`)

---

## Passo 2 — Vercel (Frontend React)

### 2.1 Criar conta
1. Acesse https://vercel.com
2. Clique em **Sign Up** (GitHub recomendado)
3. Confirme seu email

### 2.2 Importar projeto
1. Clique em **Add New** → **Project**
2. Selecione o repositório `Projeto-agendamento-API`
3. Em **Root Directory**, clique em **Edit** e selecione `front_end`
4. Em **Build and Output Settings**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.3 Configurar variável de ambiente
1. Clique em **Environment Variables**
2. Adicione:
   - **Name:** `VITE_API_URL`
   - **Value:** URL do backend Railway (ex: `https://backend-production.up.railway.app`)
3. Clique em **Deploy**

### 2.4 Obter URL do frontend
1. Após o deploy, a Vercel mostra a URL do seu site
   (ex: `https://agendafacil.vercel.app`)

---

## Passo 3 — Conectar frontend e backend

1. Volte ao Railway
2. No serviço **Node.js**, vá em **Variables**
3. Adicione:
   - **Name:** `CORS_ORIGIN`
   - **Value:** URL do frontend Vercel (ex: `https://agendafacil.vercel.app`)
4. O Railway reinicia automaticamente o servidor

---

## ✅ Pronto!

| Componente | URL |
|------------|-----|
| **Frontend** | `https://agendafacil.vercel.app` |
| **Backend** | `https://backend-production.up.railway.app` |
| **Site no GitHub** | `https://github.com/niltonsSantana-devBa/Projeto-agendamento-API` |
