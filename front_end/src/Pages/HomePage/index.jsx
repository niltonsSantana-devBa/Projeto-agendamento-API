import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function HomePage() {
  const [stats, setStats] = useState({ clientes: 0, profissionais: 0, servicos: 0, agendamentos: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [resClientes, resProfissionais, resServicos, resAgendamentos] = await Promise.all([
          api.get('/clientes'),
          api.get('/profissionais'),
          api.get('/servicos'),
          api.get('/agendamentos')
        ]);
        setStats({
          clientes: resClientes.data.length,
          profissionais: resProfissionais.data.length,
          servicos: resServicos.data.length,
          agendamentos: resAgendamentos.data.length
        });
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Painel de Controle</h2>
      <p>Bem-vindo ao sistema AgendaFácil. Abaixo está o resumo atual do seu sistema:</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div className="stat-card" style={cardStyle}>
          <h3>Clientes</h3>
          <p style={numberStyle}>{stats.clientes}</p>
        </div>
        <div className="stat-card" style={cardStyle}>
          <h3>Profissionais</h3>
          <p style={numberStyle}>{stats.profissionais}</p>
        </div>
        <div className="stat-card" style={cardStyle}>
          <h3>Serviços</h3>
          <p style={numberStyle}>{stats.servicos}</p>
        </div>
        <div className="stat-card" style={cardStyle}>
          <h3>Agendamentos</h3>
          <p style={numberStyle}>{stats.agendamentos}</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  flex: 1,
  textAlign: 'center'
};

const numberStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '10px 0 0 0'
};

export default HomePage;
