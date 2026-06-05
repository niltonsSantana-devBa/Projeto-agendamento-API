import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    }
  };

  useEffect(() => { carregarClientes(); }, []);

  const onSubmit = async (data) => {
    try {
      const payload = { nome: data.nome, email: data.email, telefone: data.telefone || null };

      if (editando) {
        await api.put(`/clientes/${editando}`, payload);
        toast.success("Cliente atualizado!");
      } else {
        await api.post('/clientes', payload);
        toast.success("Cliente cadastrado!");
      }
      reset();
      setEditando(null);
      carregarClientes();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar");
    }
  };

  const editar = (c) => {
    setEditando(c.id);
    setValue('nome', c.nome);
    setValue('email', c.email);
    setValue('telefone', c.telefone || '');
  };

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente excluído!");
      carregarClientes();
    } catch (error) {
      toast.error("Erro ao excluir cliente");
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    reset();
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Clientes</h2>
      
      <div className="form-container">
        <h3>{editando ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input {...register('nome', { required: true })} placeholder="Ex: João da Silva" />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" {...register('email', { required: true })} placeholder="exemplo@email.com" />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input {...register('telefone')} placeholder="(11) 99999-9999" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-salvar">
              {editando ? 'Atualizar' : 'Salvar Cliente'}
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
        <h3>Lista de Clientes ({clientes.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone || '-'}</td>
                <td>
                  <button onClick={() => editar(cliente)} className="btn-editar" style={{ marginRight: '6px' }}>Editar</button>
                  <button onClick={() => excluir(cliente.id)} className="btn-cancelar">Excluir</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientesPage;
