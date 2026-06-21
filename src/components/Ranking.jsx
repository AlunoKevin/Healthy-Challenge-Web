import React, { useState, useEffect } from 'react';
import '../styles/Ranking.css';

const Ranking = () => {
  // Aba ativa inicia em 'amigos'
  const [abaAtiva, setAbaAtiva] = useState('amigos'); 
  const [usuarios, setUsuarios] = useState([]);
  
  // Controle de estado para abrir e fechar o menu do perfil
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Dados simulados para a interface
  const mockRankingGlobal = [
    { id: 1, nome: 'Ana Silva', pontos: 2450, badge: '🔥 Streak 30 dias' },
    { id: 2, nome: 'Carlos Edu', pontos: 2100, badge: '🚴 15 min diários' },
    { id: 3, nome: 'Você', pontos: 1850, badge: '🏃 Iniciante' },
    { id: 4, nome: 'Bia Costa', pontos: 1720, badge: '💧 Hidratada' },
  ];

  const mockRankingAmigos = [
    { id: 2, nome: 'Carlos Edu', pontos: 2100, badge: '🚴 15 min diários' },
    { id: 3, nome: 'Você', pontos: 1850, badge: '🏃 Iniciante' },
  ];

  useEffect(() => {
    if (abaAtiva === 'global') {
      setUsuarios(mockRankingGlobal);
    } else {
      setUsuarios(mockRankingAmigos);
    }
  }, [abaAtiva]);

  return (
    <div className="ranking-page-wrapper">
      
      {/* Cabeçalho embutido na página */}
      <header className="ranking-header">
        <div className="header-left">
          <h1 className="logo">Healthy Challenge Web</h1>
          <nav className="nav-links">
            <a href="#dashboard" className="nav-link">Dashboard</a>
            <a href="#atividades" className="nav-link">Atividades</a>
          </nav>
        </div>

        <div className="header-right">
          <div className="profile-menu">
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=4CAF50&color=fff" 
              alt="Foto de Perfil" 
              className="profile-pic"
              onClick={() => setDropdownAberto(!dropdownAberto)}
            />
            {dropdownAberto && (
              <div className="dropdown">
                <a href="#conta" className="dropdown-item">Minha Conta</a>
                <a href="#sair" className="dropdown-item logout">Sair</a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal do Ranking */}
      <div className="ranking-container">
        <h2>🏆 Ranking</h2>
        
        <div className="ranking-tabs">
          <button 
            className={abaAtiva === 'amigos' ? 'tab active' : 'tab'} 
            onClick={() => setAbaAtiva('amigos')}
          >
            Meus Amigos
          </button>
          <button 
            className={abaAtiva === 'global' ? 'tab active' : 'tab'} 
            onClick={() => setAbaAtiva('global')}
          >
            Global
          </button>
        </div>

        <div className="ranking-list">
          {usuarios.map((user, index) => (
            <div key={user.id} className={`ranking-card ${user.nome === 'Você' ? 'highlight' : ''}`}>
              <div className="ranking-position">#{index + 1}</div>
              <div className="ranking-info">
                <span className="ranking-name">{user.nome}</span>
                <span className="ranking-badge">{user.badge}</span>
              </div>
              <div className="ranking-points">{user.pontos} pts</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Ranking;