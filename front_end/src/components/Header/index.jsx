import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './style.css';

const ICONES = {
  Dashboard: '📊',
  Agenda: '📅',
  Clientes: '👥',
  Profissionais: '👷',
  Serviços: '⚡',
  Agendamentos: '📋',
  'Meus Serviços': '⚡',
  'Meus Agendamentos': '📋',
  Arquitetos: '🏛️',
  Agendar: '📝',
  'Cadastre-se': '📝',
  Login: '🔑'
};

function Header() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      setUsuario(JSON.parse(stored));
    }
    const handleStorage = () => {
      const stored = localStorage.getItem('usuario');
      setUsuario(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('login', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('login', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const linksPublicos = () => (
    <>
      <span className="sidebar-section-label">PÚBLICO</span>
      <NavLink to="/arquitetos">
        <span className="nav-icon">{ICONES.Arquitetos}</span> Arquitetos
      </NavLink>
      <NavLink to="/agendar">
        <span className="nav-icon">{ICONES.Agendar}</span> Agendar
      </NavLink>
      <NavLink to="/registrar-arquiteto">
        <span className="nav-icon">{ICONES['Cadastre-se']}</span> Cadastre-se
      </NavLink>
      <NavLink to="/login">
        <span className="nav-icon">{ICONES.Login}</span> Login
      </NavLink>
    </>
  );

  const linksAdmin = () => (
    <>
      <span className="sidebar-section-label">ADMINISTRATIVO</span>
      <NavLink to="/" end>
        <span className="nav-icon">{ICONES.Dashboard}</span> Dashboard
      </NavLink>
      <NavLink to="/agenda">
        <span className="nav-icon">{ICONES.Agenda}</span> Agenda
      </NavLink>
      <NavLink to="/clientes">
        <span className="nav-icon">{ICONES.Clientes}</span> Clientes
      </NavLink>
      <NavLink to="/profissionais">
        <span className="nav-icon">{ICONES.Profissionais}</span> Profissionais
      </NavLink>
      <NavLink to="/servicos">
        <span className="nav-icon">{ICONES.Serviços}</span> Serviços
      </NavLink>
      <NavLink to="/agendamentos">
        <span className="nav-icon">{ICONES.Agendamentos}</span> Agendamentos
      </NavLink>
    </>
  );

  const linksProfissional = () => (
    <>
      <span className="sidebar-section-label">MEU PAINEL</span>
      <NavLink to="/meus-servicos">
        <span className="nav-icon">{ICONES['Meus Serviços']}</span> Meus Serviços
      </NavLink>
      <NavLink to="/meus-agendamentos">
        <span className="nav-icon">{ICONES['Meus Agendamentos']}</span> Meus Agendamentos
      </NavLink>
    </>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>AgendaFácil</h1>
        <div className="logo-sub">Arquitetura &bull; Agendamentos</div>
      </div>

      <nav className="sidebar-nav">
        {usuario ? (
          <>
            {linksPublicos()}
            {usuario.perfil === 'admin' && linksAdmin()}
            {usuario.perfil === 'profissional' && linksProfissional()}
          </>
        ) : (
          linksPublicos()
        )}
      </nav>

      {usuario && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{iniciais}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{usuario.nome}</div>
              <div className="sidebar-user-role">{usuario.perfil}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-btn-logout">
            Sair da conta
          </button>
        </div>
      )}
    </aside>
  );
}

export default Header;
