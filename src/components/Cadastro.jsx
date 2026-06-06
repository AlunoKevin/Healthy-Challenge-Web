import React, { useState } from 'react';
import '../styles/Auth.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log('Dados prontos para envio:', formData);
    alert('Cadastro simulado com sucesso!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Lado esquerdo: Identidade Visual */}
        <div className="auth-banner">
          <div className="banner-content">
            <h1>Junte-se a nós!</h1>
            <p>Construa hábitos saudáveis enquanto compete de forma divertida com seus amigos.</p>
            <div className="banner-icon">🏃‍♂️💧</div>
          </div>
        </div>

        {/* Lado direito: Formulário */}
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

            {/* Senhas equalizadas lado a lado */}
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

            <button type="submit" className="btn-auth">Finalizar Cadastro</button>
          </form>
          <p className="auth-switch">
            Já tem uma conta? <button type="button" className="link-button">Faça Login</button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Cadastro;
