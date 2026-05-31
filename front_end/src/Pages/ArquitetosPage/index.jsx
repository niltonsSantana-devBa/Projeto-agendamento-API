import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function ArquitetosPage() {
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resProf, resServ] = await Promise.all([
          api.get('/profissionais'),
          api.get('/servicos')
        ]);
        setProfissionais(resProf.data);
        setServicos(resServ.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }
    carregarDados();
  }, []);

  const servicosPorProfissional = (profissionalId) =>
    servicos.filter(s => s.profissional_id === profissionalId);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nossos Arquitetos</h2>
      <p>Conheça nossa equipe de profissionais e os serviços disponíveis.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {profissionais.filter(p => p.ativo).map(p => (
          <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{p.nome}</h3>
            <p style={{ color: '#7f8c8d', margin: '0 0 15px 0' }}>{p.especialidade}</p>

            <h4 style={{ margin: '15px 0 10px 0', color: '#34495e', fontSize: '14px' }}>Serviços:</h4>
            {servicosPorProfissional(p.id).map(s => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px', marginBottom: '8px', backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <div>
                  <strong style={{ fontSize: '14px' }}>{s.nome}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#7f8c8d' }}>
                    {s.duracao_min}min • R$ {parseFloat(s.preco).toFixed(2)}
                  </p>
                </div>
                <Link to={`/agendar?profissional=${p.id}`} style={{
                  backgroundColor: '#27ae60', color: '#fff', padding: '6px 14px',
                  borderRadius: '4px', textDecoration: 'none', fontSize: '13px',
                  fontWeight: 'bold', whiteSpace: 'nowrap'
                }}>
                  Agendar
                </Link>
              </div>
            ))}
            {servicosPorProfissional(p.id).length === 0 && (
              <p style={{ fontSize: '13px', color: '#95a5a6' }}>Nenhum serviço cadastrado.</p>
            )}
          </div>
        ))}
        {profissionais.filter(p => p.ativo).length === 0 && <p>Nenhum arquiteto disponível no momento.</p>}
      </div>
    </div>
  );
}

export default ArquitetosPage;
