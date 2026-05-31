import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function RegistrarArquitetoPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setEnviando(true);
    try {
      const response = await api.post('/register/profissional', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        especialidade: data.especialidade,
        telefone: data.telefone
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      window.dispatchEvent(new Event('login'));
      toast.success('Cadastro realizado com sucesso!');
      navigate('/meus-servicos');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 style={{ textAlign: 'center' }}>Cadastro para Arquitetos</h2>
      <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
        Cadastre-se para gerenciar seus serviços e agendamentos.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '20px'
      }}>
        <div className="input-group">
          <label>Nome Completo</label>
          <input {...register('nome', { required: true })} placeholder="Seu nome" />
        </div>
        <div className="input-group">
          <label>E-mail</label>
          <input type="email" {...register('email', { required: true })} placeholder="seu@email.com" />
        </div>
        <div className="input-group">
          <label>Senha</label>
          <input type="password" {...register('senha', { required: true, minLength: 6 })} placeholder="Mínimo 6 caracteres" />
        </div>
        <div className="input-group">
          <label>Especialidade</label>
          <input {...register('especialidade', { required: true })} placeholder="Ex: Design de Interiores" />
        </div>
        <div className="input-group">
          <label>Telefone</label>
          <input {...register('telefone')} placeholder="(11) 99999-9999" />
        </div>
        <button type="submit" disabled={enviando} className="btn-salvar" style={{ width: '100%' }}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', color: '#7f8c8d' }}>
          Já tem conta? <Link to="/login" style={{ color: '#2980b9' }}>Faça login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegistrarArquitetoPage;
