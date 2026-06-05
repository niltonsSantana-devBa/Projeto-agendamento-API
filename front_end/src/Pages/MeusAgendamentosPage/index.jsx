import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const CORES = {
  pendente: { borda: '#f39c12', badgeBg: '#fef9e7', badgeText: '#b7950b' },
  confirmado: { borda: '#27ae60', badgeBg: '#d5f5e3', badgeText: '#1e8449' },
  cancelado: { borda: '#e74c3c', badgeBg: '#fadbd8', badgeText: '#c0392b' },
  reagendado: { borda: '#8e44ad', badgeBg: '#e8daef', badgeText: '#6c3483' }
};

const ROTULOS = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  reagendado: 'Reagendado'
};

function MeusAgendamentosPage() {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [sugerindo, setSugerindo] = useState(null);
  const [novoHorario, setNovoHorario] = useState('');

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agendamentos/meus');
      setAgendamentos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const agendar = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      toast.success(`Agendamento ${ROTULOS[novoStatus]} com sucesso!`);
      setSugerindo(null);
      setNovoHorario('');
      carregarAgendamentos();
    } catch (error) {
      toast.error('Erro ao atualizar agendamento');
    }
  };

  const sugerirHorario = async (id) => {
    if (!novoHorario) {
      toast.warning('Selecione uma nova data e horário');
      return;
    }
    try {
      await api.put(`/agendamentos/${id}`, {
        data_hora: novoHorario,
        status: 'reagendado'
      });
      toast.success('Novo horário sugerido com sucesso!');
      setSugerindo(null);
      setNovoHorario('');
      carregarAgendamentos();
    } catch (error) {
      toast.error('Erro ao sugerir novo horário');
    }
  };

  const agendamentosFiltrados = agendamentos.filter(a => {
    if (filtro === 'todos') return true;
    return a.status === filtro;
  });

  const formatarDataHora = (dataHora) => {
    const d = new Date(dataHora);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const inputStyle = {
    padding: '8px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px'
  };

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Meus Agendamentos</h2>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '8px', color: '#34495e' }}>Filtrar:</label>
          <select value={filtro} onChange={e => setFiltro(e.target.value)} style={inputStyle}>
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="confirmado">Confirmados</option>
            <option value="reagendado">Reagendados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
        <span style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
          {agendamentosFiltrados.length} agendamento(s)
        </span>
      </div>

      {loading ? (
        <p>Carregando agendamentos...</p>
      ) : agendamentosFiltrados.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>Nenhum agendamento encontrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {agendamentosFiltrados.map(ag => {
            const cor = CORES[ag.status] || CORES.pendente;
            return (
              <div key={ag.id} style={{
                backgroundColor: '#fff', borderRadius: '8px', padding: '20px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                borderLeft: `5px solid ${cor.borda}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                      {formatarDataHora(ag.data_hora)}
                    </h3>
                    <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                      <strong>Cliente:</strong> {ag.cliente_nome}
                    </p>
                    <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                      <strong>Email:</strong> {ag.cliente_email}
                    </p>
                    <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                      <strong>Telefone:</strong> {ag.cliente_telefone || '—'}
                    </p>
                    <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                      <strong>Serviço:</strong> {ag.servico_nome} — R$ {parseFloat(ag.servico_preco).toFixed(2)}
                    </p>
                    {ag.observacao && (
                      <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                        <strong>Obs:</strong> {ag.observacao}
                      </p>
                    )}
                    <span style={{
                      display: 'inline-block', marginTop: '8px', padding: '4px 12px',
                      borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: cor.badgeBg, color: cor.badgeText
                    }}>
                      {ROTULOS[ag.status] || ag.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
                    {(ag.status === 'pendente' || ag.status === 'reagendado') && (
                      <>
                        <button onClick={() => agendar(ag.id, 'confirmado')} style={{
                          backgroundColor: '#27ae60', color: '#fff', border: 'none',
                          padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                        }}>
                          ✓ Aceitar
                        </button>
                        <button onClick={() => agendar(ag.id, 'cancelado')} style={{
                          backgroundColor: '#e74c3c', color: '#fff', border: 'none',
                          padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                        }}>
                          ✗ Recusar
                        </button>
                      </>
                    )}

                    {ag.status === 'pendente' && (
                      <>
                        {sugerindo === ag.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <input type="datetime-local" value={novoHorario}
                              onChange={e => setNovoHorario(e.target.value)}
                              style={{ padding: '6px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '12px' }} />
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => sugerirHorario(ag.id)} style={{
                                backgroundColor: '#8e44ad', color: '#fff', border: 'none',
                                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', flex: 1
                              }}>
                                Confirmar
                              </button>
                              <button onClick={() => { setSugerindo(null); setNovoHorario(''); }} style={{
                                backgroundColor: '#95a5a6', color: '#fff', border: 'none',
                                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                              }}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setSugerindo(ag.id)} style={{
                            backgroundColor: '#8e44ad', color: '#fff', border: 'none',
                            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                          }}>
                            🔄 Sugerir Horário
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeusAgendamentosPage;
