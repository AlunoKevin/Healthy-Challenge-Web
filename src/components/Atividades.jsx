import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

const abas = {
  disponiveis: {
    label: 'Disponíveis',
    endpoint: '/desafios',
    vazio: 'Nenhum desafio disponível.',
    acao: 'inscrever'
  },
  meus: {
    label: 'Meus desafios',
    endpoint: '/desafios/meus',
    vazio: 'Você ainda não está inscrito em nenhum desafio.',
    acao: 'concluir'
  },
  concluidos: {
    label: 'Concluídos',
    endpoint: '/desafios/concluidos',
    vazio: 'Você ainda não concluiu nenhum desafio.',
    acao: null
  }
};

// busca uma lista de desafios e devolve o conjunto de ids
async function buscarIds(endpoint, token) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!resposta.ok) return new Set();
  const dados = await resposta.json();
  return new Set(dados.map((item) => item.id_desafio || item.id));
}

const Atividades = ({ onIrParaDashboard, onIrParaRanking, onVerPerfil }) => {
  const [abaAtiva, setAbaAtiva] = useState('disponiveis');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true);
      setErro('');
      try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${API_URL}${abas[abaAtiva].endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) {
          throw new Error('Erro ao carregar desafios.');
        }
        let lista = await resposta.json();

        // evita mostrar em "disponiveis" desafios ja inscritos ou concluidos
        if (abaAtiva === 'disponiveis') {
          const [idsMeus, idsConcluidos] = await Promise.all([
            buscarIds('/desafios/meus', token),
            buscarIds('/desafios/concluidos', token)
          ]);
          lista = lista.filter((item) => {
            const id = item.id_desafio || item.id;
            return !idsMeus.has(id) && !idsConcluidos.has(id);
          });
        }

        // evita mostrar em "meus desafios" os que ja foram concluidos
        if (abaAtiva === 'meus') {
          const idsConcluidos = await buscarIds('/desafios/concluidos', token);
          lista = lista.filter((item) => !idsConcluidos.has(item.id_desafio || item.id));
        }

        setItens(lista);
      } catch (error) {
        setItens([]);
        setErro(error.message || 'Erro de conexão.');
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, [abaAtiva]);

  const executarAcao = async (id, tipo) => {
    setMensagem('');
    setErro('');
    try {
      const token = localStorage.getItem('token');
      const endpoint = tipo === 'inscrever' ? `/desafios/${id}/inscrever` : `/desafios/${id}/concluir`;
      const opcoes = { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } };
      if (tipo === 'concluir') {
        opcoes.headers['Content-Type'] = 'application/json';
        opcoes.body = JSON.stringify({ id_desafio: id });
      }
      const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

      if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => ({}));
        throw new Error(dadosErro.erro || 'Não foi possível realizar a ação.');
      }

      if (tipo === 'inscrever') {
        setMensagem('Inscrição realizada com sucesso.');
        setAbaAtiva('meus');
      } else {
        setMensagem('Desafio concluído com sucesso.');
        setAbaAtiva('concluidos');
      }
    } catch (error) {
      setErro(error.message || 'Erro de conexão.');
    }
  };

  const acaoDaAba = abas[abaAtiva].acao;

  return (
    <div className="ranking-page-wrapper">
      <Header
        telaAtiva="atividades"
        onIrParaDashboard={onIrParaDashboard}
        onIrParaRanking={onIrParaRanking}
        onIrParaAtividades={() => {}}
        onVerPerfil={() => onVerPerfil(null)}
      />

      <div className="ranking-container">
        <h2>🎯 Central de Atividades</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          {Object.entries(abas).map(([chave, aba]) => (
            <button
              key={chave}
              onClick={() => setAbaAtiva(chave)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: abaAtiva === chave ? '2px solid #27ae60' : '1px solid #ddd',
                background: abaAtiva === chave ? '#eafaf1' : '#fff',
                color: abaAtiva === chave ? '#27ae60' : '#2c3e50',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {mensagem && <p style={{ color: '#27ae60', textAlign: 'center' }}>{mensagem}</p>}
        {erro && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{erro}</p>}

        <div className="ranking-list">
          {carregando ? (
            <p>Carregando...</p>
          ) : itens.length === 0 ? (
            <p>{abas[abaAtiva].vazio}</p>
          ) : (
            itens.map((item) => {
              const id = item.id_desafio || item.id;
              const pontos = item.pontuacao ?? item.pontuacao_prevista;
              return (
                <div key={id} className="ranking-card" style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
                  <span className="ranking-name">{item.titulo || item.nome}</span>

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {pontos != null && <span className="ranking-points">{pontos} pts</span>}

                    {acaoDaAba && (
                      <button
                        onClick={() => executarAcao(id, acaoDaAba)}
                        style={{
                          padding: '8px 15px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          background: acaoDaAba === 'inscrever' ? '#3498db' : '#4CAF50',
                          color: 'white'
                        }}
                      >
                        {acaoDaAba === 'inscrever' ? 'Inscrever' : 'Concluir'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Atividades;
