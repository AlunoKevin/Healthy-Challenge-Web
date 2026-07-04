import React, { useState, useEffect } from 'react';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

const Ranking = ({ onIrParaAtividades }) => {
  const [abaAtiva, setAbaAtiva] = useState('global');
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  let usuarioLogado = {};

  try {
    const cache = localStorage.getItem('usuario');
    if (cache && cache !== 'undefined') {
      usuarioLogado = JSON.parse(cache);
    }
  } catch (e) {
    console.error('Erro ao ler utilizador:', e);
  }

  useEffect(() => {
    const buscarRanking = async () => {
      try {
        setCarregando(true);

        const token = localStorage.getItem('token');

        const endpoint =
          abaAtiva === 'global'
            ? `${API_URL}/leaderboard/global`
            : `${API_URL}/leaderboard/grupo/1`;

        const resposta = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resposta.ok) {
          const dados = await resposta.json();

          const meuId = String(
            usuarioLogado.id || usuarioLogado.id_usuario || ''
          );

          const rankingFormatado = dados.map((user) => {
            const idUsuario = String(user.id_usuario || user.id || '');

            return {
              id: idUsuario || Math.random(),
              nome: user.nome || 'Utilizador',
              pontos:
                user.pontuacao_total ??
                user.pontos ??
                user.pontuacao ??
                user.score ??
                0,
              badge: user.nivel_dificuldade || 'Atleta',
              eUsuarioLogado:
                meuId !== '' &&
                idUsuario !== '' &&
                meuId === idUsuario,
            };
          });

          setUsuarios(rankingFormatado);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
        setUsuarios([]);
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
            <button
              className="nav-link active"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Dashboard
            </button>

            <button
              className="nav-link"
              onClick={onIrParaAtividades}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Atividades
            </button>
          </nav>
        </div>

        <div className="header-right">
          <div className="profile-menu">
            <img
              src={`https://ui-avatars.com/api/?name=${
                usuarioLogado.nome || 'User'
              }&background=4CAF50&color=fff`}
              alt="Foto de Perfil"
              className="profile-pic"
              onClick={() => setDropdownAberto(!dropdownAberto)}
            />

            {dropdownAberto && (
              <div className="dropdown">
                <a href="#conta" className="dropdown-item">
                  Minha Conta
                </a>

                <button
                  onClick={handleLogout}
                  className="dropdown-item logout"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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
          {carregando ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              A carregar classificação...
            </p>
          ) : usuarios.length > 0 ? (
            usuarios.map((user, index) => (
              <div
                key={user.id}
                className={`ranking-card ${
                  user.eUsuarioLogado ? 'highlight' : ''
                }`}
              >
                <div className="ranking-position">
                  #{index + 1}
                </div>

                <div className="ranking-info">
                  <span className="ranking-name">
                    {user.eUsuarioLogado ? 'Você' : user.nome}
                  </span>

                  <span className="ranking-badge">
                    {user.badge}
                  </span>
                </div>

                <div className="ranking-points">
                  {user.pontos} pts
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Nenhum utilizador encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
