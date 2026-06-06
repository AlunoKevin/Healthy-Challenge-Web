import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '15px', textAlign: 'center', backgroundColor: '#2c3e50', color: 'white' }}>
        <span style={{ marginRight: '20px', fontWeight: 'bold' }}>Modo de Teste:</span>
        <button 
          onClick={() => setTelaAtual('login')}
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: telaAtual === 'login' ? '#2ecc71' : 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Ver Login
        </button>
        <button 
          onClick={() => setTelaAtual('cadastro')}
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: telaAtual === 'cadastro' ? '#2ecc71' : 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Ver Cadastro
        </button>
      </nav>

      {telaAtual === 'login' ? <Login /> : <Cadastro />}
    </div>
  );
}

export default App;
