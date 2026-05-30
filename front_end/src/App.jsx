import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container" style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
        <Sidebar />
        <main className="main-content" style={{ flex: 1, padding: '20px', backgroundColor: '#f5f7fa', color: '#333' }}>
          <header className="top-header" style={{ marginBottom: '20px' }}>
            <h1>Bem-vindo ao novo AgendaFácil (React)</h1>
          </header>
          <section className="content-area">
            <Routes>
              <Route path="/" element={<h2>Dashboard (Em construção)</h2>} />
              <Route path="/clientes" element={<h2>Clientes (Em construção)</h2>} />
              <Route path="/profissionais" element={<h2>Profissionais (Em construção)</h2>} />
              <Route path="/servicos" element={<h2>Serviços (Em construção)</h2>} />
              <Route path="/agendamentos" element={<h2>Agendamentos (Em construção)</h2>} />
            </Routes>
          </section>
        </main>
      </div>
    </Router>
  );
}

export default App;
