import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import ClientesPage from './Pages/ClientesPage';
import ProfissionaisPage from './Pages/ProfissionaisPage';
import ServicosPage from './Pages/ServicosPage';
import AgendamentosPage from './Pages/AgendamentosPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/profissionais" element={<ProfissionaisPage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
