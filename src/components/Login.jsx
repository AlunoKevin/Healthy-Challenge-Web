import React, { useState } from 'react';
import '../styles/Auth.css';

const Login = () => {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setCredenciais({
      ...credenciais,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentativa de login com:', credenciais);
    alert('Tentativa de login enviada!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Lado esquerdo: Identidade Visual */}
        <div className="auth-banner">
          <div className="banner-content">
            {/* Adicionado um <br /> para separar e dar mais espaço às palavras */}
            <h1>Healthy<br />Challenge Web</h1>
            <p>Transforme seus hábitos em conquistas diárias. Desafie-se!</p>
            <div className="banner-icon">🏆</div>
          </div>
        </div>

        {/* Lado direito: Formulário */}
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

            {/* Texto do botão corrigido para "Entrar" */}
            <button type="submit" className="btn-auth">Entrar</button>
          </form>
          <p className="auth-switch">
            Ainda não tem conta? <button type="button" className="link-button">Cadastre-se</button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
