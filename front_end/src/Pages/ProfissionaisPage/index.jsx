import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import '../ClientesPage/style.css';

function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const carregarProfissionais = async () => {
    try {
      const response = await api.get('/profissionais');
      setProfissionais(response.data);
    } catch (error) {
      console.error("Erro ao buscar profissionais", error);
    }
  };

  useEffect(() => {
    carregarProfissionais();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/profissionais', data);
      toast.success("Profissional cadastrado com sucesso!");
      reset();
      carregarProfissionais();
    } catch (error) {
      console.error("Erro ao cadastrar profissional", error);
      toast.error("Erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Gerenciar Profissionais</h2>

      <div className="form-container">
        <h3>Cadastrar Novo Profissional</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input {...register('nome', { required: true })} placeholder="Ex: Arq. João Silva" />
          </div>
          <div className="input-group">
            <label>Especialidade</label>
            <input {...register('especialidade', { required: true })} placeholder="Ex: Design de Interiores" />
          </div>
          <button type="submit" className="btn-salvar">Salvar Profissional</button>
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
            </tr>
          </thead>
          <tbody>
            {profissionais.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.especialidade}</td>
              </tr>
            ))}
            {profissionais.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Nenhum profissional cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfissionaisPage;
