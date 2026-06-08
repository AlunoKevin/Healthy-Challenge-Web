import React, { useState } from 'react';
import '../styles/Auth.css';

const API_URL = 'http://localhost:3001';

const Cadastro = ({ onIrParaLogin }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const resposta = await fetch(`${API_URL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          nivel_dificuldade: 'F'
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao cadastrar usuário.');
      }

      alert('Cadastro realizado com sucesso! Faça login para continuar.');

      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
      });

      onIrParaLogin();
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
            <h1>Junte-se a nós!</h1>
            <p>Construa hábitos saudáveis enquanto compete de forma divertida com seus amigos.</p>
            <div className="banner-icon">🏃‍♂️💧</div>
          </div>
        </div>

        <div className="auth-form-container">
          <h2>Criar Conta ✨</h2>
          <p>Preencha os dados abaixo para iniciar sua jornada.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-half">
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-half">
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="••••••••"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {erro && <p className="auth-error">{erro}</p>}

            <button type="submit" className="btn-auth" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>

          <p className="auth-switch">
            Já tem uma conta?{' '}
            <button type="button" className="link-button" onClick={onIrParaLogin}>
              Faça Login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Cadastro;