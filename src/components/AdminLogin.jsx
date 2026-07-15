import React, { useState } from 'react';
import '../styles/Auth.css';

const API_URL = 'http://localhost:3001';

const AdminLogin = ({ onIrParaLogin, onSucesso }) => {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: '',
    chave_de_acesso: ''
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

      const resposta = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciais)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Credenciais de administrador inválidas.');
      }

      localStorage.setItem('adminToken', dados.token);
      localStorage.setItem('adminEmail', credenciais.email);

      onSucesso();
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
            <p>Área restrita para administradores.</p>
            <div className="banner-icon">🛠️</div>
          </div>
        </div>

        <div className="auth-form-container">
          <h2>Acesso do administrador 🔐</h2>
          <p>Entre com suas credenciais para gerenciar os desafios.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={credenciais.email}
                onChange={handleChange}
                placeholder="admin@exemplo.com"
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

            <div className="form-group">
              <label>Chave de acesso</label>
              <input
                type="password"
                name="chave_de_acesso"
                value={credenciais.chave_de_acesso}
                onChange={handleChange}
                placeholder="Chave de acesso do administrador"
                required
              />
            </div>

            {erro && <p className="auth-error">{erro}</p>}

            <button type="submit" className="btn-auth" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-switch">
            Não é administrador?{' '}
            <button type="button" className="link-button" onClick={onIrParaLogin}>
              Voltar para o login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
