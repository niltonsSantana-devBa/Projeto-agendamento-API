import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState([]);
  const [editando, setEditando] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const carregarProfissionais = async () => {
    try {
      const response = await api.get('/profissionais');
      setProfissionais(response.data);
    } catch (error) {
      console.error("Erro ao buscar profissionais", error);
    }
  };

  useEffect(() => { carregarProfissionais(); }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nome: data.nome,
        especialidade: data.especialidade,
        telefone: data.telefone || null,
        ativo: data.ativo === 'true' || data.ativo === true ? 1 : 0
      };

      if (editando) {
        await api.put(`/profissionais/${editando}`, payload);
        toast.success("Profissional atualizado!");
      } else {
        await api.post('/profissionais', payload);
        toast.success("Profissional cadastrado!");
      }
      reset();
      setEditando(null);
      carregarProfissionais();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar");
    }
  };

  const editar = (p) => {
    setEditando(p.id);
    setValue('nome', p.nome);
    setValue('especialidade', p.especialidade);
    setValue('telefone', p.telefone || '');
    setValue('ativo', p.ativo ? 'true' : 'false');
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza? Excluir este profissional também removerá TODOS os serviços e agendamentos vinculados a ele.')) return;
    try {
      await api.delete(`/profissionais/${id}`);
      toast.success("Profissional excluído!");
      carregarProfissionais();
    } catch (error) {
      toast.error("Erro ao excluir profissional");
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    reset({ ativo: 'true' });
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Profissionais</h2>

      <div className="form-container">
        <h3>{editando ? 'Editar Profissional' : 'Cadastrar Novo Profissional'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input {...register('nome', { required: true })} placeholder="Ex: Arq. João Silva" />
          </div>
          <div className="input-group">
            <label>Especialidade</label>
            <input {...register('especialidade', { required: true })} placeholder="Ex: Design de Interiores" />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input {...register('telefone')} placeholder="(11) 99999-9999" />
          </div>
          <div className="input-group">
            <label>Ativo</label>
            <select {...register('ativo')}>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-salvar">
              {editando ? 'Atualizar' : 'Salvar Profissional'}
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
        <h3>Lista de Profissionais ({profissionais.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {profissionais.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.especialidade}</td>
                <td>{p.telefone || '-'}</td>
                <td>{p.ativo ? 'Sim' : 'Não'}</td>
                <td>
                  <button onClick={() => editar(p)} className="btn-editar" style={{ marginRight: '6px' }}>Editar</button>
                  <button onClick={() => excluir(p.id)} className="btn-cancelar">Excluir</button>
                </td>
              </tr>
            ))}
            {profissionais.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum profissional cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfissionaisPage;
