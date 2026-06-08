import React, { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      {telaAtual === 'login' ? (
        <Login onIrParaCadastro={() => setTelaAtual('cadastro')} />
      ) : (
        <Cadastro onIrParaLogin={() => setTelaAtual('login')} />
      )}
    </div>
  );
}

export default App;