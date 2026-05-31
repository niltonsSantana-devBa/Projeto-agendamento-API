import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import '../ClientesPage/style.css';

function ServicosPage() {
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const { register, handleSubmit, reset } = useForm();

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

  useEffect(() => {
    carregarDados();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/servicos', {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        duracao_min: Number(data.duracao_min),
        profissional_id: Number(data.profissional_id)
      });
      toast.success("Serviço cadastrado com sucesso!");
      reset();
      carregarDados();
    } catch (error) {
      console.error("Erro ao cadastrar serviço", error);
      toast.error("Erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Serviços</h2>

      <div className="form-container">
        <h3>Cadastrar Novo Serviço</h3>
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
            <input type="number" {...register('duracao_min', { required: true })} placeholder="Ex: 60" defaultValue={60} />
          </div>
          <div className="input-group">
            <label>Profissional</label>
            <select {...register('profissional_id', { required: true })}>
              <option value="">Selecione um profissional...</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.especialidade}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-salvar">Salvar Serviço</button>
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
              </tr>
            ))}
            {servicos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum serviço cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServicosPage;
