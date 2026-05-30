import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header-container">
      <div className="logo">
        <h1>AgendaFácil</h1>
      </div>
      <nav className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/agendamentos">Agendamentos</Link>
      </nav>
    </header>
  );
}

export default Header;
