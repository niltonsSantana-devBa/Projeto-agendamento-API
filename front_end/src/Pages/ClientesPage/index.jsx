import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import './style.css'; // Vamos criar um estilo básico

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/clientes', data);
      reset(); // Limpa o formulário
      carregarClientes(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao cadastrar cliente", error);
      alert("Erro ao cadastrar. O email já pode existir.");
    }
  };

  return (
    <div className="page-container">
      <h2>Gerenciar Clientes</h2>
      
      <div className="form-container">
        <h3>Cadastrar Novo Cliente</h3>
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
          <button type="submit" className="btn-salvar">Salvar Cliente</button>
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
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone || '-'}</td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientesPage;
