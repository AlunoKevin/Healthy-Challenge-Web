import React from 'react';

const JogoMemoria = ({ onVoltar }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #effcf7 0%, #b8e6c0 100%)',
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
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🧠
        </div>

        <h1 style={{ color: '#20344d', marginBottom: '0.75rem' }}>
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

        <div
          style={{
            background: '#f6faf8',
            border: '1px solid #dcebe3',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          <strong style={{ color: '#22a95a' }}>
            Tela inicial criada com sucesso
          </strong>

          <p
            style={{
              color: '#667085',
              margin: '0.5rem 0 0'
            }}
          >
            Na próxima etapa, o jogo será conectado ao backend.
          </p>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          style={{
            border: 'none',
            borderRadius: '12px',
            padding: '0.9rem 1.5rem',
            background: '#22a95a',
            color: '#ffffff',
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