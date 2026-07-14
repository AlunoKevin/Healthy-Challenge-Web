import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import Atividades from './components/Atividades';
import Perfil from './components/Perfil';

function App() {
  const [telaAtual, setTelaAtual] = useState(localStorage.getItem('token') ? 'dashboard' : 'login');

  const [perfilUsuario, setPerfilUsuario] = useState(null);

  function abrirPerfil(usuarioRanking) {
    setPerfilUsuario(usuarioRanking || null);
    setTelaAtual('perfil');
  }

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
          onIrParaRanking={() => setTelaAtual('ranking')}
          onIrParaAtividades={() => setTelaAtual('atividades')}
          onVerPerfil={abrirPerfil}
        />
      )}

      {telaAtual === 'ranking' && (
        <Ranking
          onIrParaDashboard={() => setTelaAtual('dashboard')}
          onIrParaAtividades={() => setTelaAtual('atividades')}
          onVerPerfil={abrirPerfil}
        />
      )}

      {telaAtual === 'atividades' && (
        <Atividades
          onIrParaDashboard={() => setTelaAtual('dashboard')}
          onIrParaRanking={() => setTelaAtual('ranking')}
          onVerPerfil={abrirPerfil}
        />
      )}

      {/* TELA: PERFIL */}
      {telaAtual === 'perfil' && (
        <Perfil
          usuarioRanking={perfilUsuario}
          onIrParaDashboard={() => setTelaAtual('dashboard')}
          onIrParaRanking={() => setTelaAtual('ranking')}
          onIrParaAtividades={() => setTelaAtual('atividades')}
          onVerPerfil={abrirPerfil}
        />
      )}
      
    </div>
  );
}

export default App;