import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function MeusServicosPage() {
  const [servicos, setServicos] = useState([]);
  const [editando, setEditando] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const carregarServicos = async () => {
    try {
      const res = await api.get('/servicos/meus');
      setServicos(res.data);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
    }
  };

  useEffect(() => { carregarServicos(); }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        preco: parseFloat(data.preco),
        duracao_min: parseInt(data.duracao_min),
        profissional_id: usuario.profissionalId
      };

      if (editando) {
        await api.put(`/servicos/${editando}`, payload);
        toast.success('Serviço atualizado');
      } else {
        await api.post('/servicos', payload);
        toast.success('Serviço criado');
      }
      reset();
      setEditando(null);
      carregarServicos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar');
    }
  };

  const editar = (s) => {
    setEditando(s.id);
    reset({
      nome: s.nome,
      descricao: s.descricao,
      preco: s.preco,
      duracao_min: s.duracao_min
    });
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este serviço?')) return;
    try {
      await api.delete(`/servicos/${id}`);
      toast.success('Serviço excluído');
      carregarServicos();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    reset({ nome: '', descricao: '', preco: '', duracao_min: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Meus Serviços</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{
        backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px'
      }}>
        <h3>{editando ? 'Editar Serviço' : 'Novo Serviço'}</h3>
        <div className="input-group">
          <label>Nome</label>
          <input {...register('nome', { required: true })} placeholder="Nome do serviço" />
        </div>
        <div className="input-group">
          <label>Descrição</label>
          <textarea {...register('descricao')} rows="2" placeholder="Descrição opcional" />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" {...register('preco', { required: true })} placeholder="0,00" />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Duração (min)</label>
            <input type="number" {...register('duracao_min', { required: true })} placeholder="60" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-salvar">
            {editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && (
            <button type="button" onClick={cancelarEdicao} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {servicos.map(s => (
          <div key={s.id} style={{
            backgroundColor: '#fff', padding: '15px', borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <strong>{s.nome}</strong>
              <p style={{ margin: '5px 0', color: '#7f8c8d', fontSize: '0.9em' }}>{s.descricao}</p>
              <span style={{ color: '#2980b9', fontWeight: 'bold' }}>
                R$ {parseFloat(s.preco).toFixed(2)} &middot; {s.duracao_min} min
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => editar(s)} className="btn-editar">Editar</button>
              <button onClick={() => excluir(s.id)} className="btn-cancelar">Excluir</button>
            </div>
          </div>
        ))}
        {servicos.length === 0 && (
          <p style={{ color: '#7f8c8d', textAlign: 'center' }}>
            Nenhum serviço cadastrado. Crie seu primeiro serviço acima.
          </p>
        )}
      </div>
    </div>
  );
}

export default MeusServicosPage;
