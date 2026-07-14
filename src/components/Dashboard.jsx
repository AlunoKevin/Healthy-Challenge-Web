import React, { useState, useEffect } from 'react';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

// NOVO: recebe onVerPerfil vindo do App.jsx
const Dashboard = ({ onIrParaAtividades, onVerPerfil }) => {
  const [abaAtiva, setAbaAtiva] = useState('global');
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || {};

  useEffect(() => {
    const buscarRanking = async () => {
      try {
        setCarregando(true);
        const token = localStorage.getItem('token');
        
        let endpoint = abaAtiva === 'global' 
          ? `${API_URL}/leaderboard/global` 
          : `${API_URL}/leaderboard/grupo/1`;

        const resposta = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          
          const rankingFormatado = dados.map((user) => ({
             id: user.id_usuario || Math.random(), 
             nome: user.nome || 'Usuário',
             // CORREÇÃO: Agora usamos o campo exato descoberto em image_ad2665.png
             pontos: user.pontuacao_total || 0,
             badge: user.nivel_dificuldade || 'Atleta',
             eUsuarioLogado: String(user.id_usuario) === String(usuarioLogado.id) || 
                             user.nome === usuarioLogado.nome
          }));
          
          setUsuarios(rankingFormatado);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarRanking();
  }, [abaAtiva]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload(); 
  };

  return (
    <div className="ranking-page-wrapper">
      <header className="ranking-header">
        <div className="header-left">
          <h1 className="logo">Healthy Challenge Web</h1>
          <nav className="nav-links">
            <button className="nav-link active" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Dashboard</button>
            <button className="nav-link" onClick={onIrParaAtividades} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Atividades</button>
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
                {/* "Ver perfil" abre o meu próprio perfil, com os dados do ranking atual se disponíveis */}
                <button
                  onClick={() => {
                    setDropdownAberto(false);
                    const indice = usuarios.findIndex((u) => u.eUsuarioLogado);
                    const meuRegistro = indice >= 0 ? usuarios[indice] : null;
                    onVerPerfil(
                      meuRegistro
                        ? { ...meuRegistro, posicao: indice + 1, aba: abaAtiva }
                        : null
                    );
                  }}
                  className="dropdown-item"
                  style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Ver perfil
                </button>
                <button onClick={handleLogout} className="dropdown-item logout" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>Sair</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="ranking-container">
        <h2>🏆 Ranking</h2>
        <div className="ranking-list">
          {carregando ? <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando...</p> : 
           usuarios.map((user, index) => (
              <div
                key={user.id}
                className={`ranking-card ${user.eUsuarioLogado ? 'highlight' : ''}`}
                // Clicar num usuário abre o perfil dele (ou o seu, se for você mesmo)
                onClick={() => onVerPerfil({ ...user, posicao: index + 1, aba: abaAtiva })}
                style={{ cursor: 'pointer' }}
              >
                <div className="ranking-position">#{index + 1}</div>
                <div className="ranking-info">
                  <span className="ranking-name">{user.eUsuarioLogado ? 'Você' : user.nome}</span>
                </div>
                <div className="ranking-points">{user.pontos} pts</div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;