import React, { useState } from 'react';
import '../styles/Ranking.css';

// Header compartilhado por Dashboard, Ranking, Atividades e Perfil.
// Clicar na logo leva para o Dashboard (resumo pessoal); as abas do menu
// levam para Ranking e Atividades.
const Header = ({ telaAtiva, onIrParaDashboard, onIrParaRanking, onIrParaAtividades, onVerPerfil, onLogout }) => {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload();
  };

  return (
    <header className="ranking-header">
      <div className="header-left">
        <h1 className="logo" onClick={onIrParaDashboard} style={{ cursor: 'pointer' }}>
          Healthy Challenge Web
        </h1>
        <nav className="nav-links">
          <button
            className={`nav-link ${telaAtiva === 'ranking' ? 'active' : ''}`}
            onClick={onIrParaRanking}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Ranking
          </button>
          <button
            className={`nav-link ${telaAtiva === 'atividades' ? 'active' : ''}`}
            onClick={onIrParaAtividades}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Atividades
          </button>
        </nav>
      </div>
      <div className="header-right">
        <div className="profile-menu">
          <img
            src={`https://ui-avatars.com/api/?name=${usuarioLogado.nome || 'User'}&background=4CAF50&color=fff`}
            alt="Foto de Perfil"
            className="profile-pic"
            onClick={() => setDropdownAberto(!dropdownAberto)}
            style={{ cursor: 'pointer' }}
          />
          {dropdownAberto && (
            <div className="dropdown">
              <button
                onClick={() => {
                  setDropdownAberto(false);
                  onVerPerfil();
                }}
                className="dropdown-item"
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Ver perfil
              </button>
              <button
                onClick={onLogout || handleLogout}
                className="dropdown-item logout"
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
