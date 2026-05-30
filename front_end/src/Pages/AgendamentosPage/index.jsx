import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import './style.css';

function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const carregarDados = async () => {
    try {
      const [resAgendamentos, resClientes, resProfissionais, resServicos] = await Promise.all([
        api.get('/agendamentos'),
        api.get('/clientes'),
        api.get('/profissionais'),
        api.get('/servicos')
      ]);
      setAgendamentos(resAgendamentos.data);
      setClientes(resClientes.data);
      setProfissionais(resProfissionais.data);
      setServicos(resServicos.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/agendamentos', data);
      toast.success("Agendamento criado com sucesso!");
      reset();
      carregarDados();
    } catch (error) {
      console.error("Erro ao cadastrar agendamento", error);
      toast.error("Erro ao cadastrar agendamento. Verifique os dados.");
    }
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Agendamentos</h2>
      
      <div className="form-container">
        <h3>Novo Agendamento</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Cliente</label>
            <select {...register('ClienteId', { required: true })}>
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Profissional</label>
            <select {...register('ProfissionalId', { required: true })}>
              <option value="">Selecione um profissional...</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Serviço</label>
            <select {...register('ServicoId', { required: true })}>
              <option value="">Selecione um serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Data e Hora</label>
            <input type="datetime-local" {...register('data', { required: true })} />
          </div>
          <div className="input-group">
            <label>Status</label>
            <select {...register('status')}>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <button type="submit" className="btn-salvar">Agendar</button>
        </form>
      </div>

      <div className="list-container">
        <h3>Lista de Agendamentos ({agendamentos.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Profissional</th>
              <th>Serviço</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(agenda => (
              <tr key={agenda.id}>
                <td>{agenda.id}</td>
                <td>{new Date(agenda.data).toLocaleString()}</td>
                <td>{agenda.Cliente?.nome || 'N/A'}</td>
                <td>{agenda.Profissional?.nome || 'N/A'}</td>
                <td>{agenda.Servico?.nome || 'N/A'}</td>
                <td>{agenda.status}</td>
              </tr>
            ))}
            {agendamentos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum agendamento cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgendamentosPage;
