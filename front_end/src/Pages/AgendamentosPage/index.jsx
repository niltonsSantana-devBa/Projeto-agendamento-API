import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

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
      await api.post('/agendamentos', {
        data_hora: data.data_hora,
        cliente_id: Number(data.cliente_id),
        servico_id: Number(data.servico_id),
        status: data.status || 'pendente',
        observacao: data.observacao || null
      });
      toast.success("Agendamento criado com sucesso!");
      reset();
      carregarDados();
    } catch (error) {
      console.error("Erro ao cadastrar agendamento", error);
      toast.error("Erro ao cadastrar agendamento. Verifique os dados.");
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await api.delete(`/agendamentos/${id}`);
      toast.success("Agendamento excluído!");
      carregarDados();
    } catch (error) {
      toast.error("Erro ao excluir agendamento");
    }
  };

  const statusLabel = (s) => {
    const labels = { pendente: 'Pendente', confirmado: 'Confirmado', reagendado: 'Reagendado', cancelado: 'Cancelado' };
    return labels[s] || s;
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
            <select {...register('cliente_id', { required: true })}>
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Serviço</label>
            <select {...register('servico_id', { required: true })}>
              <option value="">Selecione um serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - {s.profissional_nome}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Data e Hora</label>
            <input type="datetime-local" {...register('data_hora', { required: true })} />
          </div>
          <div className="input-group">
            <label>Observação</label>
            <textarea {...register('observacao')} placeholder="Observações sobre o agendamento" />
          </div>
          <div className="input-group">
            <label>Status</label>
            <select {...register('status')}>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="reagendado">Reagendado</option>
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
              <th>Data/Hora</th>
              <th>Cliente</th>
              <th>Profissional</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(agenda => (
              <tr key={agenda.id}>
                <td>{agenda.id}</td>
                <td>{new Date(agenda.data_hora).toLocaleString()}</td>
                <td>{agenda.cliente_nome || 'N/A'}</td>
                <td>{agenda.profissional_nome || 'N/A'}</td>
                <td>{agenda.servico_nome || 'N/A'}</td>
                <td>{statusLabel(agenda.status)}</td>
                <td>
                  <button onClick={() => excluir(agenda.id)} className="btn-cancelar">Excluir</button>
                </td>
              </tr>
            ))}
            {agendamentos.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum agendamento cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgendamentosPage;
