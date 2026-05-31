import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './style.css';

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

  return (
    <header className="header-container">
      <div className="logo">
        <NavLink to="/" end style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>AgendaFácil</h1>
        </NavLink>
      </div>
      <nav className="nav-links">
        <NavLink to="/arquitetos">Arquitetos</NavLink>
        <NavLink to="/agendar">Agendar</NavLink>

        {usuario ? (
          <>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/clientes">Clientes</NavLink>
            <NavLink to="/profissionais">Profissionais</NavLink>
            <NavLink to="/servicos">Serviços</NavLink>
            <NavLink to="/agendamentos">Agendamentos</NavLink>
            <span className="user-info">
              {usuario.nome}
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            </span>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;
