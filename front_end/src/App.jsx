import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import ClientesPage from './Pages/ClientesPage';
import ProfissionaisPage from './Pages/ProfissionaisPage';
import ServicosPage from './Pages/ServicosPage';
import AgendamentosPage from './Pages/AgendamentosPage';
import ArquitetosPage from './Pages/ArquitetosPage';
import AgendarPage from './Pages/AgendarPage';
import LoginPage from './Pages/LoginPage';
import AgendaPage from './Pages/AgendaPage';
import RegistrarArquitetoPage from './Pages/RegistrarArquitetoPage';
import MeusServicosPage from './Pages/MeusServicosPage';
import MeusAgendamentosPage from './Pages/MeusAgendamentosPage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <div className="app-main">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
              <Route path="/arquitetos" element={<ArquitetosPage />} />
              <Route path="/agendar" element={<AgendarPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registrar-arquiteto" element={<RegistrarArquitetoPage />} />
              <Route path="/meus-servicos" element={<PrivateRoute><MeusServicosPage /></PrivateRoute>} />
              <Route path="/meus-agendamentos" element={<PrivateRoute><MeusAgendamentosPage /></PrivateRoute>} />
              <Route path="/agenda" element={<PrivateRoute><AgendaPage /></PrivateRoute>} />
              <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
              <Route path="/profissionais" element={<PrivateRoute><ProfissionaisPage /></PrivateRoute>} />
              <Route path="/servicos" element={<PrivateRoute><ServicosPage /></PrivateRoute>} />
              <Route path="/agendamentos" element={<PrivateRoute><AgendamentosPage /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
