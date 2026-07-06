import React, { useEffect, useState } from 'react';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

const abas = {
  disponiveis: {
    label: 'Disponíveis',
    endpoint: '/desafios',
    vazio: 'Nenhum desafio disponível.'
  },
  meus: {
    label: 'Meus desafios',
    endpoint: '/desafios/meus',
    vazio: 'Você ainda não está inscrito em nenhum desafio.'
  },
  concluidos: {
    label: 'Concluídos',
    endpoint: '/desafios/concluidos',
    vazio: 'Você ainda não concluiu nenhum desafio.'
  }
};

const Atividades = ({ onIrParaDashboard }) => {
  const [abaAtiva, setAbaAtiva] = useState('disponiveis');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true);
      setMensagem('');
      setErro('');

      try {
        const token = localStorage.getItem('token');

        const resposta = await fetch(`${API_URL}${abas[abaAtiva].endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!resposta.ok) {
          const dadosErro = await resposta.json().catch(() => ({}));
          throw new Error(dadosErro.erro || 'Erro ao carregar desafios.');
        }

        const dados = await resposta.json();
        let lista = Array.isArray(dados) ? dados : [];

        const buscarIds = async (endpoint) => {
          const respostaIds = await fetch(`${API_URL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!respostaIds.ok) {
            return new Set();
          }

          const dadosIds = await respostaIds.json();

          return new Set(
            dadosIds.map((desafio) => desafio.id_desafio || desafio.id)
          );
        };

        if (abaAtiva === 'disponiveis') {
          const idsMeusDesafios = await buscarIds('/desafios/meus');
          const idsConcluidos = await buscarIds('/desafios/concluidos');

          lista = lista.filter((desafio) => {
            const idDesafio = desafio.id_desafio || desafio.id;

            return !idsMeusDesafios.has(idDesafio) && !idsConcluidos.has(idDesafio);
          });
        }

        if (abaAtiva === 'meus') {
          const idsConcluidos = await buscarIds('/desafios/concluidos');

          lista = lista.filter((desafio) => {
            const idDesafio = desafio.id_desafio || desafio.id;

            return !idsConcluidos.has(idDesafio);
          });
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
    try {
      const token = localStorage.getItem('token');

      const endpoint =
        tipo === 'inscrever'
          ? `/desafios/${id}/inscrever`
          : `/desafios/${id}/concluir`;

      const resposta = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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

  const obterId = (item) => item.id_desafio || item.id;
  const obterTitulo = (item) => item.titulo || item.nome || 'Desafio';
  const obterPontos = (item) => item.pontuacao_prevista || item.pontuacao || 0;

  return (
    <div className="ranking-page-wrapper">
      <header className="ranking-header">
        <div className="header-left">
          <h1 className="logo">Healthy Challenge Web</h1>

          <nav className="nav-links">
            <button
              className="nav-link"
              onClick={onIrParaDashboard}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Dashboard
            </button>

            <button
              className="nav-link active"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Atividades
            </button>
          </nav>
        </div>
      </header>

      <div className="ranking-container">
        <h2>🎯 Central de Atividades</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center' }}>
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

        {mensagem && (
          <p style={{ color: '#27ae60', textAlign: 'center', fontWeight: 600 }}>
            {mensagem}
          </p>
        )}

        {erro && (
          <p style={{ color: '#c0392b', textAlign: 'center', fontWeight: 600 }}>
            {erro}
          </p>
        )}

        <div className="ranking-list">
          {carregando && <p style={{ textAlign: 'center' }}>Carregando...</p>}

          {!carregando && !erro && itens.length === 0 && (
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
              {abas[abaAtiva].vazio}
            </p>
          )}

          {!carregando &&
            itens.map((item) => {
              const id = obterId(item);

              return (
                <div
                  key={id}
                  className="ranking-card"
                  style={{ display: 'flex', alignItems: 'center', padding: '15px' }}
                >
                  <div>
                    <span className="ranking-name">{obterTitulo(item)}</span>

                    {item.descricao && (
                      <p style={{ margin: '6px 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                        {item.descricao}
                      </p>
                    )}
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="ranking-points">{obterPontos(item)} pts</span>

                    {abaAtiva === 'disponiveis' && (
                      <button
                        onClick={() => executarAcao(id, 'inscrever')}
                        style={{
                          padding: '8px 15px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          background: '#3498db',
                          color: 'white'
                        }}
                      >
                        Inscrever
                      </button>
                    )}

                    {abaAtiva === 'meus' && (
                      <button
                        onClick={() => executarAcao(id, 'concluir')}
                        style={{
                          padding: '8px 15px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          background: '#4CAF50',
                          color: 'white'
                        }}
                      >
                        Concluir
                      </button>
                    )}

                    {abaAtiva === 'concluidos' && (
                      <span style={{ color: '#27ae60', fontWeight: 600 }}>
                        Concluído
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Atividades;