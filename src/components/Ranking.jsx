import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Ranking.css';

const Ranking = () => {
  const [abaAtiva, setAbaAtiva] = useState('amigos'); 
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para controlar qual card de usuário está aberto
  const [usuarioExpandido, setUsuarioExpandido] = useState(null);

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
    setUsuarios(abaAtiva === 'global' ? mockRankingGlobal : mockRankingAmigos);
    setUsuarioExpandido(null); // Fecha o card aberto ao trocar de aba
  }, [abaAtiva]);

  const handleCardClick = (userId) => {
    // Se for o próprio usuário, não expande a opção de "ver perfil"
    if (userId === 3) return; 
    setUsuarioExpandido(usuarioExpandido === userId ? null : userId);
  };

  return (
    <div className="ranking-page-wrapper">
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
            <div 
              key={user.id} 
              className={`ranking-card ${user.nome === 'Você' ? 'highlight' : ''} ${usuarioExpandido === user.id ? 'expanded' : ''}`}
              onClick={() => handleCardClick(user.id)}
            >
              <div className="card-main-content">
                <div className="ranking-position">#{index + 1}</div>
                <div className="ranking-info">
                  <span className="ranking-name">{user.nome}</span>
                  <span className="ranking-badge">{user.badge}</span>
                </div>
                <div className="ranking-points">{user.pontos} pts</div>
              </div>
              
              {/* Opção de ver perfil renderizada condicionalmente */}
              {usuarioExpandido === user.id && (
                <div className="card-expanded-action">
                   <Link to={`/perfil/${user.id}`} className="btn-ver-perfil">
                     👁️ Ver Perfil de {user.nome.split(' ')[0]}
                   </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ranking;