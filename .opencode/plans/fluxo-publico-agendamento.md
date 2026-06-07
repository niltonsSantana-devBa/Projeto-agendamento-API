# 🏛️ Plano: Fluxo Público de Agendamento

## Objetivo
Transformar o sistema em um site onde:
- **Arquitetos** se cadastram (via admin) com seus dados e serviços
- **Clientes** acessam o site, veem os arquitetos e agendam online

---

## 📦 Mudanças Necessárias

### 🔧 Backend — 1 rota NOVA

**Arquivo:** `back_and/scr/index.js`

Adicionar APÓS a rota `GET /clientes` (linha 69):

```js
// Buscar cliente por email (para agendamento público)
app.get('/clientes/email/:email', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ where: { email: req.params.email } });
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) { res.status(500).json({ error: error.message }); }
});
```

> Só isso no backend. As rotas de POST, GET, etc. já existem.

---

### 🖥️ Frontend — 2 páginas NOVAS

---

#### Página 1: `ArquitetosPage` (rota `/arquitetos`)

**Arquivo novo:** `front_end/src/Pages/ArquitetosPage/index.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function ArquitetosPage() {
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resProf, resServ] = await Promise.all([
          api.get('/profissionais'),
          api.get('/servicos')
        ]);
        setProfissionais(resProf.data);
        setServicos(resServ.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }
    carregarDados();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nossos Arquitetos</h2>
      <p>Conheça nossa equipe de profissionais especializados.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {profissionais.map(p => (
          <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{p.nome}</h3>
            <p style={{ color: '#7f8c8d', margin: '0 0 15px 0' }}>{p.especialidade}</p>
            <Link to={`/agendar?profissional=${p.id}`} style={{ display: 'inline-block', backgroundColor: '#27ae60', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
              Agendar com {p.nome.split(' ')[0]}
            </Link>
          </div>
        ))}
        {profissionais.length === 0 && <p>Nenhum arquiteto cadastrado ainda.</p>}
      </div>

      <h2 style={{ marginTop: '40px' }}>Nossos Serviços</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {servicos.map(s => (
          <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{s.nome}</h3>
            <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>{s.descricao}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60', margin: 0 }}>R$ {parseFloat(s.preco).toFixed(2)}</p>
          </div>
        ))}
        {servicos.length === 0 && <p>Nenhum serviço cadastrado ainda.</p>}
      </div>
    </div>
  );
}

export default ArquitetosPage;
```

---

#### Página 2: `AgendarPage` (rota `/agendar`)

**Arquivo novo:** `front_end/src/Pages/AgendarPage/index.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function AgendarPage() {
  const [searchParams] = useSearchParams();
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const [resProf, resServ] = await Promise.all([
          api.get('/profissionais'),
          api.get('/servicos')
        ]);
        setProfissionais(resProf.data);
        setServicos(resServ.data);

        // Se veio de /arquitetos?profissional=ID, já seleciona
        const profId = searchParams.get('profissional');
        if (profId) setValue('ProfissionalId', profId);
      } catch (error) {
        console.error("Erro ao carregar", error);
      }
    }
    carregar();
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      // 1. Verificar se cliente já existe pelo email
      let clienteId = null;
      try {
        const res = await api.get(`/clientes/email/${encodeURIComponent(data.email)}`);
        clienteId = res.data.id;
      } catch (err) {
        // Cliente não existe → criar
        const res = await api.post('/clientes', {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone
        });
        clienteId = res.data.id;
      }

      // 2. Criar agendamento
      await api.post('/agendamentos', {
        data: data.data,
        ClienteId: clienteId,
        ProfissionalId: Number(data.ProfissionalId),
        ServicoId: Number(data.ServicoId),
        status: 'pendente'
      });

      toast.success("Agendamento realizado com sucesso! Aguarde a confirmação.");
    } catch (error) {
      console.error("Erro ao agendar", error);
      toast.error("Erro ao realizar agendamento. Verifique os dados.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Agende sua Visita</h2>
      <p>Preencha seus dados e escolha o profissional e serviço desejado.</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Nome Completo</label>
          <input {...register('nome', { required: true })} placeholder="Seu nome" style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>E-mail</label>
          <input type="email" {...register('email', { required: true })} placeholder="seu@email.com" style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Telefone</label>
          <input {...register('telefone')} placeholder="(11) 99999-9999" style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Profissional</label>
          <select {...register('ProfissionalId', { required: true })} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">Selecione um arquiteto...</option>
            {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.especialidade}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Serviço</label>
          <select {...register('ServicoId', { required: true })} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">Selecione um serviço...</option>
            {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {parseFloat(s.preco).toFixed(2)}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Data e Hora</label>
          <input type="datetime-local" {...register('data', { required: true })} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <button type="submit" disabled={enviando} style={{ backgroundColor: enviando ? '#95a5a6' : '#27ae60', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%' }}>
          {enviando ? 'Enviando...' : 'Solicitar Agendamento'}
        </button>
      </form>
    </div>
  );
}

export default AgendarPage;
```

---

### 📄 Arquivos que serão MODIFICADOS

#### 1. `App.jsx` — Adicionar import e rotas

Adicionar imports:
```jsx
import ArquitetosPage from './Pages/ArquitetosPage';
import AgendarPage from './Pages/AgendarPage';
```

Adicionar rotas dentro de `<Routes>`:
```jsx
<Route path="/arquitetos" element={<ArquitetosPage />} />
<Route path="/agendar" element={<AgendarPage />} />
```

#### 2. `Header/index.jsx` — Adicionar links públicos

Adicionar entre Dashboard e Clientes:
```jsx
<NavLink to="/arquitetos">Arquitetos</NavLink>
<NavLink to="/agendar">Agendar</NavLink>
```

Ordem final do menu:
```
Dashboard | Arquitetos | Agendar | Clientes | Profissionais | Serviços | Agendamentos
```

---

### ✅ Checklist de Execução

- [ ] **Backend:** Adicionar rota `GET /clientes/email/:email`
- [ ] **Frontend:** Criar `ArquitetosPage/index.jsx`
- [ ] **Frontend:** Criar `AgendarPage/index.jsx`
- [ ] **Frontend:** Modificar `App.jsx` (imports + rotas)
- [ ] **Frontend:** Modificar `Header/index.jsx` (links)
- [ ] **Testar:** `GET /clientes/email/teste@teste.com`
- [ ] **Testar:** Acessar `/arquitetos` no navegador
- [ ] **Testar:** Acessar `/agendar` e agendar um serviço
- [ ] **Git:** `git add . && git commit -m "feat: fluxo publico - arquitetos e agendamento" && git push`

---

## 📊 Resumo

```
ANTES:                    DEPOIS:
/          (dashboard)    /            (dashboard - admin)
/clientes  (admin)        /clientes    (admin)
/profissionais (admin)    /profissionais (admin)
/servicos  (admin)        /servicos    (admin)
/agendamentos (admin)     /agendamentos (admin)
                          /arquitetos  ★ PÚBLICO - ver arquitetos
                          /agendar     ★ PÚBLICO - agendar online

Backend: 0 bibliotecas novas | Frontend: 0 bibliotecas novas
Tudo com React Hook Form, Axios, Sequelize = o que você já sabe!
```
