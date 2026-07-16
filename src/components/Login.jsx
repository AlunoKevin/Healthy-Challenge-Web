import React, { useState } from 'react';
import '../styles/Auth.css';

const API_URL = 'http://localhost:3001';

const Login = ({ onIrParaCadastro, onIrParaAdminLogin, onSucesso }) => {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setCredenciais({
      ...credenciais,
      [e.target.name]: e.target.value
    });

    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCarregando(true);
      setErro('');

      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credenciais.email,
          senha: credenciais.senha
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'E-mail ou senha inválidos.');
      }

      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      onSucesso();

      // Futuramente, aqui será feito o redirecionamento para a página inicial.
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-banner">
          <div className="banner-content">
            <h1>Healthy<br />Challenge Web</h1>
            <p>Transforme seus hábitos em conquistas diárias. Desafie-se!</p>
            <div className="banner-icon">🏆</div>
          </div>
        </div>

        <div className="auth-form-container">
          <h2>Bem-vindo de volta! 👋</h2>
          <p>Acesse sua conta e continue evoluindo.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={credenciais.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={credenciais.senha}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {erro && <p className="auth-error">{erro}</p>}

            <button type="submit" className="btn-auth" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-switch">
            Ainda não tem conta?{' '}
            <button type="button" className="link-button" onClick={onIrParaCadastro}>
              Cadastre-se
            </button>
          </p>

          {onIrParaAdminLogin && (
            <p className="auth-switch">
              É administrador?{' '}
              <button type="button" className="link-button" onClick={onIrParaAdminLogin}>
                Acesse aqui
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;