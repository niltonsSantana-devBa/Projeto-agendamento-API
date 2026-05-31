import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const response = await api.post('/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      window.dispatchEvent(new Event('login'));
      toast.success('Login realizado com sucesso!');
      const perfil = response.data.usuario.perfil;
      navigate(perfil === 'profissional' ? '/meus-servicos' : '/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>E-mail</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@agendafacil.com" required
            style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#34495e' }}>Senha</label>
          <input
            type="password" value={senha} onChange={e => setSenha(e.target.value)}
            placeholder="Sua senha" required
            style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>
        <button type="submit" disabled={enviando} style={{
          backgroundColor: enviando ? '#95a5a6' : '#2980b9', color: '#fff', border: 'none',
          padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
          fontSize: '16px', width: '100%'
        }}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d', fontSize: '0.9em' }}>
          É arquiteto? <Link to="/registrar-arquiteto" style={{ color: '#2980b9' }}>Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
