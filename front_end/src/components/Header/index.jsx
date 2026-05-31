import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <h1>AgendaFácil</h1>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/arquitetos">Arquitetos</NavLink>
        <NavLink to="/agendar">Agendar</NavLink>
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/profissionais">Profissionais</NavLink>
        <NavLink to="/servicos">Serviços</NavLink>
        <NavLink to="/agendamentos">Agendamentos</NavLink>
      </nav>
    </header>
  );
}

export default Header;
