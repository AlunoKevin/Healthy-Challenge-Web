import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const location = useLocation();

  // Mantém a verificação de aba ativa
  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header">
      <div className="header-content">
        
        <div className="header-left">
          <Link to="/" className="logo-link">
            <h1 className="logo">🌱 Healthy Challenge Web</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <Link 
            to="/ranking" 
            className={`nav-link ${isActive('/ranking') ? 'active' : ''}`}
          >
            🏆 Ranking
          </Link>
          <Link 
            to="/desafios" 
            className={`nav-link ${isActive('/desafios') ? 'active' : ''}`}
          >
            🎯 Desafios
          </Link>
        </nav>

        <div className="header-right">
          <div className="profile-menu">
            <img 
              src="https://ui-avatars.com/api/?name=User&background=27ae60&color=fff" 
              alt="Foto de Perfil" 
              className="profile-pic"
              onClick={() => setDropdownAberto(!dropdownAberto)}
            />
            
            {dropdownAberto && (
              <div className="dropdown">
                <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownAberto(false)}>👤 Acessar Perfil</Link>
                <Link to="/amigos" className="dropdown-item" onClick={() => setDropdownAberto(false)}>👥 Adicionar Amigos</Link>
                <button className="dropdown-item logout" onClick={() => console.log('Deslogar')}>🚪 Deslogar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;