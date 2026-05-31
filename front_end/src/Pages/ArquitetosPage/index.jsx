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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nossos Arquitetos</h2>
      <p>Conheça nossa equipe de profissionais especializados.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {profissionais.map(p => (
          <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{p.nome}</h3>
            <p style={{ color: '#7f8c8d', margin: '0 0 15px 0' }}>{p.especialidade}</p>
            <Link to={`/agendar?profissional=${p.id}`} style={{ display: 'inline-block', backgroundColor: '#27ae60', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
              Agendar com {p.nome.split(' ')[0]}
            </Link>
          </div>
        ))}
        {profissionais.length === 0 && <p>Nenhum arquiteto cadastrado ainda.</p>}
      </div>

      <h2 style={{ marginTop: '40px' }}>Nossos Serviços</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {servicos.map(s => (
          <div key={s.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{s.nome}</h3>
            <p style={{ color: '#7f8c8d', margin: '0 0 5px 0' }}>{s.descricao}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60', margin: 0 }}>R$ {parseFloat(s.preco).toFixed(2)}</p>
          </div>
        ))}
        {servicos.length === 0 && <p>Nenhum serviço cadastrado ainda.</p>}
      </div>
    </div>
  );
}

export default ArquitetosPage;
