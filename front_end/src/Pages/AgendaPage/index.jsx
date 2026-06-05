import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function AgendaPage() {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarAgenda = async (dataSelecionada) => {
    setLoading(true);
    try {
      const response = await api.get(`/agendamentos?data=${dataSelecionada}`);
      setAgendamentos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agenda');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgenda(data);
  }, [data]);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      toast.success(`Agendamento ${novoStatus} com sucesso!`);
      carregarAgenda(data);
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const formatarDataHora = (dataHora) => {
    const d = new Date(dataHora);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Agenda do Dia</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#34495e' }}>Selecione a data:</label>
        <input
          type="date" value={data} onChange={e => setData(e.target.value)}
          style={{ padding: '8px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '14px' }}
        />
      </div>

      {loading ? (
        <p>Carregando agenda...</p>
      ) : agendamentos.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>Nenhum agendamento para esta data.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {agendamentos.map(ag => (
            <div key={ag.id} style={{
              backgroundColor: '#fff', borderRadius: '8px', padding: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              borderLeft: `5px solid ${
                ag.status === 'confirmado' ? '#27ae60' :
                ag.status === 'cancelado' ? '#e74c3c' :
                ag.status === 'reagendado' ? '#8e44ad' : '#f39c12'
              }`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                    {formatarDataHora(ag.data_hora)} — {ag.cliente_nome}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                    <strong>Serviço:</strong> {ag.servico_nome}
                  </p>
                  <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                    <strong>Profissional:</strong> {ag.profissional_nome}
                  </p>
                  {ag.observacao && (
                    <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                      <strong>Obs:</strong> {ag.observacao}
                    </p>
                  )}
                  <span style={{
                    display: 'inline-block', marginTop: '10px', padding: '4px 12px',
                    borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor:
                      ag.status === 'confirmado' ? '#d5f5e3' :
                      ag.status === 'cancelado' ? '#fadbd8' :
                      ag.status === 'reagendado' ? '#e8daef' : '#fef9e7',
                    color:
                      ag.status === 'confirmado' ? '#1e8449' :
                      ag.status === 'cancelado' ? '#c0392b' :
                      ag.status === 'reagendado' ? '#6c3483' : '#b7950b'
                  }}>
                    {ag.status === 'confirmado' ? 'Confirmado' :
                     ag.status === 'cancelado' ? 'Cancelado' :
                     ag.status === 'reagendado' ? 'Reagendado' : 'Pendente'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {ag.status === 'pendente' && (
                    <>
                      <button onClick={() => atualizarStatus(ag.id, 'confirmado')} style={{
                        backgroundColor: '#27ae60', color: '#fff', border: 'none',
                        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                      }}>
                        Confirmar
                      </button>
                      <button onClick={() => atualizarStatus(ag.id, 'cancelado')} style={{
                        backgroundColor: '#e74c3c', color: '#fff', border: 'none',
                        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                      }}>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgendaPage;
