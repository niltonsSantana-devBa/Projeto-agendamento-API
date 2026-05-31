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
  const { register, handleSubmit, setValue } = useForm();
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
      let clienteId = null;
      try {
        const res = await api.get(`/clientes/email/${encodeURIComponent(data.email)}`);
        clienteId = res.data.id;
      } catch (err) {
        const res = await api.post('/clientes', {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone
        });
        clienteId = res.data.id;
      }

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
