import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Ranking from './components/Ranking';
import Header from './components/Header';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const mostrarHeader = location.pathname !== '/login' && location.pathname !== '/cadastro';

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {mostrarHeader && <Header />}

      <Routes>
        <Route 
          path="/login" 
          element={
            <Login 
              onIrParaCadastro={() => navigate('/cadastro')} 
              onSucesso={() => navigate('/ranking')} 
            />
          } 
        />

        <Route 
          path="/cadastro" 
          element={
            <Cadastro 
              onIrParaLogin={() => navigate('/login')} 
              onSucesso={() => navigate('/ranking')} 
            />
          } 
        />

        <Route 
          path="/ranking" 
          element={<Ranking />} 
        />
        
        <Route 
          path="/" 
          element={
            <div style={{ padding: '4rem', textAlign: 'center', color: '#2c3e50' }}>
              <h2>Página Inicial em Construção 🚧</h2>
              <p>Esta será a home do Healthy Challenge Web.</p>
            </div>
          } 
        />
      </Routes>
      
    </div>
  );
}

function App() {
  return (
    // O Router deve envolver toda a aplicação
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;