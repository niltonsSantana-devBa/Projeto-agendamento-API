import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function ServicosPage() {
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [editando, setEditando] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const carregarDados = async () => {
    try {
      const [resServicos, resProf] = await Promise.all([
        api.get('/servicos'),
        api.get('/profissionais')
      ]);
      setServicos(resServicos.data);
      setProfissionais(resProf.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao || null,
        preco: parseFloat(data.preco),
        duracao_min: parseInt(data.duracao_min) || 60,
        profissional_id: Number(data.profissional_id)
      };

      if (editando) {
        await api.put(`/servicos/${editando}`, payload);
        toast.success("Serviço atualizado!");
      } else {
        await api.post('/servicos', payload);
        toast.success("Serviço cadastrado!");
      }
      reset();
      setEditando(null);
      carregarDados();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar");
    }
  };

  const editar = (s) => {
    setEditando(s.id);
    setValue('nome', s.nome);
    setValue('descricao', s.descricao || '');
    setValue('preco', s.preco);
    setValue('duracao_min', s.duracao_min);
    setValue('profissional_id', s.profissional_id);
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await api.delete(`/servicos/${id}`);
      toast.success("Serviço excluído!");
      carregarDados();
    } catch (error) {
      toast.error("Erro ao excluir serviço");
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    reset();
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Serviços</h2>

      <div className="form-container">
        <h3>{editando ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Nome do Serviço</label>
            <input {...register('nome', { required: true })} placeholder="Ex: Consultoria Inicial" />
          </div>
          <div className="input-group">
            <label>Descrição</label>
            <input {...register('descricao')} placeholder="Descrição opcional do serviço" />
          </div>
          <div className="input-group">
            <label>Preço (R$)</label>
            <input type="number" step="0.01" {...register('preco', { required: true })} placeholder="Ex: 250.00" />
          </div>
          <div className="input-group">
            <label>Duração (minutos)</label>
            <input type="number" {...register('duracao_min', { required: true })} placeholder="Ex: 60" />
          </div>
          <div className="input-group">
            <label>Profissional</label>
            <select {...register('profissional_id', { required: true })}>
              <option value="">Selecione um profissional...</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.especialidade}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-salvar">
              {editando ? 'Atualizar' : 'Salvar Serviço'}
            </button>
            {editando && (
              <button type="button" onClick={cancelarEdicao} className="btn-cancelar">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-container">
        <h3>Lista de Serviços ({servicos.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Duração</th>
              <th>Profissional</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nome}</td>
                <td>{s.descricao || '-'}</td>
                <td>R$ {parseFloat(s.preco).toFixed(2)}</td>
                <td>{s.duracao_min}min</td>
                <td>{s.profissional_nome || '-'}</td>
                <td>
                  <button onClick={() => editar(s)} className="btn-editar" style={{ marginRight: '6px' }}>Editar</button>
                  <button onClick={() => excluir(s.id)} className="btn-cancelar">Excluir</button>
                </td>
              </tr>
            ))}
            {servicos.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum serviço cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServicosPage;
