import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard'; // Presumo que você renomeou Ranking para Dashboard
import Atividades from './components/Atividades'; // <-- IMPORTAQUI AQUI

function App() {
  const [telaAtual, setTelaAtual] = useState(localStorage.getItem('token') ? 'dashboard' : 'login');

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {telaAtual === 'login' && (
        <Login 
          onIrParaCadastro={() => setTelaAtual('cadastro')} 
          onSucesso={() => setTelaAtual('dashboard')} 
        />
      )}

      {telaAtual === 'cadastro' && (
        <Cadastro 
          onIrParaLogin={() => setTelaAtual('login')} 
          onSucesso={() => setTelaAtual('dashboard')} 
        />
      )}

      {telaAtual === 'dashboard' && (
        <Dashboard 
          onIrParaAtividades={() => setTelaAtual('atividades')} // Cria esse botão na Navbar do seu Dashboard!
          onLogout={() => {
            localStorage.removeItem('token');
            setTelaAtual('login');
          }}
        />
      )}

      {/* NOVA TELA ADICIONADA */}
      {telaAtual === 'atividades' && (
        <Atividades 
          onIrParaDashboard={() => setTelaAtual('dashboard')} 
        />
      )}
      
    </div>
  );
}

export default App;
