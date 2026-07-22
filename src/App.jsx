import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import Atividades from './components/Atividades';
import Perfil from './components/Perfil';
import AdminLogin from './components/AdminLogin';
import AdminDesafios from './components/AdminDesafios';
import JogoMemoria from './components/JogoMemoria';

function telaInicial() {
  if (localStorage.getItem('adminToken')) return 'admin';
  if (localStorage.getItem('token')) return 'dashboard';
  return 'login';
}

function App() {
  const [telaAtual, setTelaAtual] = useState(telaInicial());

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
          onIrParaAdminLogin={() => setTelaAtual('loginAdmin')}
          onSucesso={() => setTelaAtual('dashboard')}
        />
      )}

      {telaAtual === 'loginAdmin' && (
        <AdminLogin
          onIrParaLogin={() => setTelaAtual('login')}
          onSucesso={() => setTelaAtual('admin')}
        />
      )}

      {telaAtual === 'admin' && (
        <AdminDesafios onLogout={() => setTelaAtual('loginAdmin')} />
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
          onIrParaJogo={() => setTelaAtual('jogoMemoria')}
          onVerPerfil={abrirPerfil}
        />
      )}

      {telaAtual === 'jogoMemoria' && (
        <JogoMemoria onVoltar={() => setTelaAtual('atividades')} />
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