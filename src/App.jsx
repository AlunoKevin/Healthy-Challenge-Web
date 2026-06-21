import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Ranking from './components/Ranking';

function App() {
  const [telaAtual, setTelaAtual] = useState('ranking');

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {telaAtual === 'login' && (
        <Login 
          onIrParaCadastro={() => setTelaAtual('cadastro')} 
          onSucesso={() => setTelaAtual('ranking')} 
        />
      )}

      {telaAtual === 'cadastro' && (
        <Cadastro 
          onIrParaLogin={() => setTelaAtual('login')} 
          onSucesso={() => setTelaAtual('ranking')} 
        />
      )}

      {telaAtual === 'ranking' && (
        <Ranking />
      )}
      
    </div>
  );
}

export default App;