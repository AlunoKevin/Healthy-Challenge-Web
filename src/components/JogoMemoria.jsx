import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

const JogoMemoria = ({ onVoltar }) => {
  const [partida, setPartida] = useState(null);
  const [etapa, setEtapa] = useState('inicio');
  const [selecionadas, setSelecionadas] = useState([]);
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!partida || etapa !== 'memorizando') {
      return undefined;
    }

    const tempo = Number(partida.tempo_memorizacao) * 1000;

    const temporizador = setTimeout(() => {
      setFeedback('');
      setEtapa('selecionando');
    }, tempo);

    return () => {
      clearTimeout(temporizador);
    };
  }, [partida, etapa]);

  const iniciarPartida = async () => {
    try {
      setCarregando(true);
      setErro('');
      setFeedback('');
      setSelecionadas([]);
      setResultadoFinal(null);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const resposta = await fetch(`${API_URL}/jogo/iniciar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível iniciar a partida.'
        );
      }

      setPartida(dados);
      setEtapa('memorizando');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const estaSelecionada = (linha, coluna) => {
    return selecionadas.some(
      ([linhaSelecionada, colunaSelecionada]) =>
        linhaSelecionada === linha &&
        colunaSelecionada === coluna
    );
  };

  const selecionarCelula = (linha, coluna) => {
    if (etapa !== 'selecionando' || enviando) {
      return;
    }

    const selecionada = estaSelecionada(linha, coluna);

    if (selecionada) {
      setSelecionadas((anteriores) =>
        anteriores.filter(
          ([linhaSelecionada, colunaSelecionada]) =>
            linhaSelecionada !== linha ||
            colunaSelecionada !== coluna
        )
      );

      return;
    }

    if (selecionadas.length >= partida.quantidade_ativos) {
      return;
    }

    setSelecionadas((anteriores) => [
      ...anteriores,
      [linha, coluna]
    ]);
  };

  const selecaoCompleta =
    partida &&
    selecionadas.length === partida.quantidade_ativos;

  const enviarJogada = async () => {
    if (!selecaoCompleta || enviando) {
      return;
    }

    try {
      setEnviando(true);
      setErro('');

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const resposta = await fetch(`${API_URL}/jogo/jogada`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          posicoes: selecionadas,
          tempo_restante: partida.tempo_restante
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível enviar a jogada.'
        );
      }

      if (dados.resultado === 'acertou') {
        setFeedback(
          `Resposta correta! Você ganhou ${dados.pontos_ganhos} pontos.`
        );

        setPartida(dados);
        setSelecionadas([]);
        setEtapa('memorizando');
        return;
      }

      if (
        dados.resultado === 'derrota' ||
        dados.resultado === 'vitoria'
      ) {
        setResultadoFinal(dados);
        setEtapa('fim');
        return;
      }

      throw new Error('Resposta inesperada do servidor.');
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const voltarParaAtividades = async () => {
    const token = localStorage.getItem('token');

    if (partida && token) {
      try {
        await fetch(`${API_URL}/jogo/abandonar`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Erro ao abandonar partida:', error);
      }
    }

    onVoltar();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #effcf7 0%, #b8e6c0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '700px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 20px 50px rgba(31, 122, 70, 0.18)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}
        >
          🧠
        </div>

        <h1
          style={{
            color: '#20344d',
            marginBottom: '0.75rem'
          }}
        >
          Memória Matricial
        </h1>

        <p
          style={{
            color: '#667085',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}
        >
          Memorize as posições destacadas e selecione as mesmas células
          antes que o tempo termine.
        </p>

        {erro && (
          <div
            style={{
              background: '#fff3f3',
              border: '1px solid #f0b8b8',
              color: '#a12828',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            {erro}
          </div>
        )}

        {feedback && etapa !== 'fim' && (
          <div
            style={{
              background: '#edf8f1',
              border: '1px solid #b7ddc5',
              color: '#247a45',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontWeight: 700
            }}
          >
            {feedback}
          </div>
        )}

        {!partida && (
          <div
            style={{
              background: '#f6faf8',
              border: '1px solid #dcebe3',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <p
              style={{
                color: '#667085',
                margin: '0 0 1.25rem'
              }}
            >
              Ao iniciar, a primeira matriz será carregada pelo servidor.
            </p>

            <button
              type="button"
              onClick={iniciarPartida}
              disabled={carregando}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '0.9rem 1.5rem',
                background: carregando ? '#9acdad' : '#22a95a',
                color: '#ffffff',
                fontWeight: 700,
                cursor: carregando ? 'not-allowed' : 'pointer'
              }}
            >
              {carregando ? 'Iniciando...' : 'Iniciar partida'}
            </button>
          </div>
        )}

        {partida && etapa !== 'fim' && (
          <section
            style={{
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}
            >
              <span
                style={{
                  background: '#edf8f1',
                  color: '#247a45',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  fontWeight: 700
                }}
              >
                Rodada {partida.rodada}
              </span>

              <span
                style={{
                  background: '#edf8f1',
                  color: '#247a45',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  fontWeight: 700
                }}
              >
                Nível {partida.nivel}
              </span>

              <span
                style={{
                  background: '#edf8f1',
                  color: '#247a45',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  fontWeight: 700
                }}
              >
                Tempo: {partida.tempo_restante}s
              </span>
            </div>

            {etapa === 'memorizando' && (
              <div
                style={{
                  background: '#edf8f1',
                  color: '#247a45',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  fontWeight: 700
                }}
              >
                Memorize as células verdes. Elas desaparecerão após{' '}
                {partida.tempo_memorizacao} segundos.
              </div>
            )}

            {etapa === 'selecionando' && (
              <div
                style={{
                  background: '#f3f6ff',
                  color: '#294b8f',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <strong>
                  Agora selecione as células memorizadas.
                </strong>

                <div
                  style={{
                    marginTop: '0.5rem'
                  }}
                >
                  Selecionadas: {selecionadas.length} de{' '}
                  {partida.quantidade_ativos}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${partida.dimensao}, 1fr)`,
                gap: '8px',
                width: '100%',
                maxWidth: '420px',
                margin: '0 auto'
              }}
            >
              {partida.matriz.map((linha, indiceLinha) =>
                linha.map((valor, indiceColuna) => {
                  const selecionada = estaSelecionada(
                    indiceLinha,
                    indiceColuna
                  );

                  const mostrarComoAtiva =
                    etapa === 'memorizando' && valor === 1;

                  return (
                    <button
                      key={`${indiceLinha}-${indiceColuna}`}
                      type="button"
                      aria-label={`Célula ${indiceLinha + 1}, ${
                        indiceColuna + 1
                      }`}
                      disabled={
                        etapa !== 'selecionando' || enviando
                      }
                      onClick={() =>
                        selecionarCelula(
                          indiceLinha,
                          indiceColuna
                        )
                      }
                      style={{
                        aspectRatio: '1',
                        borderRadius: '10px',
                        border: selecionada
                          ? '3px solid #176b3a'
                          : '2px solid #dcebe3',
                        background: mostrarComoAtiva
                          ? '#22a95a'
                          : selecionada
                            ? '#71d398'
                            : '#f5f7f6',
                        cursor:
                          etapa === 'selecionando' && !enviando
                            ? 'pointer'
                            : 'default',
                        transition:
                          'background 0.2s ease, border 0.2s ease'
                      }}
                    />
                  );
                })
              )}
            </div>

            {etapa === 'selecionando' && (
              <button
                type="button"
                onClick={enviarJogada}
                disabled={!selecaoCompleta || enviando}
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem 1.5rem',
                  marginTop: '1.5rem',
                  background:
                    selecaoCompleta && !enviando
                      ? '#22a95a'
                      : '#a7cbb5',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor:
                    selecaoCompleta && !enviando
                      ? 'pointer'
                      : 'not-allowed'
                }}
              >
                {enviando
                  ? 'Verificando...'
                  : 'Confirmar seleção'}
              </button>
            )}
          </section>
        )}

        {etapa === 'fim' && resultadoFinal && (
          <section
            style={{
              background:
                resultadoFinal.resultado === 'vitoria'
                  ? '#edf8f1'
                  : '#fff3f3',
              border:
                resultadoFinal.resultado === 'vitoria'
                  ? '1px solid #b7ddc5'
                  : '1px solid #f0b8b8',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}
            >
              {resultadoFinal.resultado === 'vitoria'
                ? '🏆'
                : '😔'}
            </div>

            <h2
              style={{
                color:
                  resultadoFinal.resultado === 'vitoria'
                    ? '#247a45'
                    : '#a12828',
                marginBottom: '0.75rem'
              }}
            >
              {resultadoFinal.resultado === 'vitoria'
                ? 'Você venceu!'
                : 'Fim de jogo'}
            </h2>

            {resultadoFinal.resultado === 'derrota' && (
              <p
                style={{
                  color: '#667085',
                  marginBottom: '1rem'
                }}
              >
                {resultadoFinal.motivo === 'tempo_esgotado'
                  ? 'O tempo da partida terminou.'
                  : 'As posições selecionadas não estavam corretas.'}
              </p>
            )}

            <strong
              style={{
                color: '#20344d'
              }}
            >
              Pontos: {resultadoFinal.pontos_totais}
            </strong>
          </section>
        )}

        <button
          type="button"
          onClick={voltarParaAtividades}
          style={{
            border: '1px solid #22a95a',
            borderRadius: '12px',
            padding: '0.9rem 1.5rem',
            background: '#ffffff',
            color: '#22a95a',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Voltar para Atividades
        </button>
      </main>
    </div>
  );
};

export default JogoMemoria;