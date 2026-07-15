import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../styles/Ranking.css';
import '../styles/Perfil.css';

const API_URL = 'http://localhost:3001';

// Resumo pessoal do usuário logado, aberto ao clicar na logo do app.
const Dashboard = ({ onIrParaRanking, onIrParaAtividades, onVerPerfil }) => {
  const [resumo, setResumo] = useState({ pontos: 0, posicao: null, badge: '—', desafiosAtivos: 0 });
  const [carregando, setCarregando] = useState(true);

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
    const buscarResumo = async () => {
      try {
        setCarregando(true);
        const token = localStorage.getItem('token');
        const meuId = String(usuarioLogado.id || usuarioLogado.id_usuario || '');

        const [respostaRanking, respostaDesafios] = await Promise.all([
          fetch(`${API_URL}/leaderboard/global`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/desafios/meus`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        let pontos = 0;
        let posicao = null;
        let badge = usuarioLogado.liga || '—';

        if (respostaRanking.ok) {
          const dados = await respostaRanking.json();
          const indice = dados.findIndex((user) => String(user.id_usuario || user.id || '') === meuId);
          if (indice >= 0) {
            pontos = dados[indice].pontuacao_total ?? 0;
            posicao = indice + 1;
            badge = dados[indice].liga || badge;
          }
        }

        let desafiosAtivos = 0;
        if (respostaDesafios.ok) {
          const desafios = await respostaDesafios.json();
          desafiosAtivos = Array.isArray(desafios) ? desafios.length : 0;
        }

        setResumo({ pontos, posicao, badge, desafiosAtivos });
      } catch (error) {
        console.error('Erro ao buscar resumo do dashboard:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarResumo();
  }, []);

  return (
    <div className="ranking-page-wrapper">
      <Header
        telaAtiva="dashboard"
        onIrParaDashboard={() => {}}
        onIrParaRanking={onIrParaRanking}
        onIrParaAtividades={onIrParaAtividades}
        onVerPerfil={() => onVerPerfil(null)}
      />

      <div className="ranking-container">
        <h2>Olá, {usuarioLogado.nome || 'Atleta'}!</h2>

        {carregando ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando...</p>
        ) : (
          <div className="ranking-summary">
            <div className="rank-pill">
              <span className="rank-pill__label">⭐ Pontuação</span>
              <span className="rank-pill__value">{resumo.pontos} pts</span>
            </div>
            <div className="rank-pill">
              <span className="rank-pill__label">🏆 Posição no ranking global</span>
              <span className="rank-pill__value">{resumo.posicao ? `#${resumo.posicao}` : '—'}</span>
            </div>
            <div className="rank-pill">
              <span className="rank-pill__label">🔥 Nível</span>
              <span className="rank-pill__value">{resumo.badge}</span>
            </div>
            <div className="rank-pill">
              <span className="rank-pill__label">🎯 Desafios ativos</span>
              <span className="rank-pill__value">{resumo.desafiosAtivos}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
