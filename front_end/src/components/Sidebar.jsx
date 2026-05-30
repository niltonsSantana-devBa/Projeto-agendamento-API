import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Opcional, podemos usar index.css global

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo">
        <i className="fas fa-archway"></i>
        <span>AgendaFácil</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-th-large"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-users"></i> Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/profissionais" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-user-tie"></i> Profissionais
          </NavLink>
        </li>
        <li>
          <NavLink to="/servicos" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-concierge-bell"></i> Serviços
          </NavLink>
        </li>
        <li>
          <NavLink to="/agendamentos" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-calendar-alt"></i> Agendamentos
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>© 2026 Clínica de Arquitetura</p>
      </div>
    </nav>
  );
};

export default Sidebar;
