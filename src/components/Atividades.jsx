import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

const Atividades = ({ onIrParaDashboard, onIrParaRanking, onVerPerfil }) => {
  const [abaAtiva, setAbaAtiva] = useState('desafios');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ... (useEffect igual ao anterior para buscar os dados)
  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true);
      try {
        const token = localStorage.getItem('token');
        const endpoint = abaAtiva === 'desafios' ? '/desafios' : '/historico';
        const resposta = await fetch(`${API_URL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resposta.ok) {
          const dados = await resposta.json();
          setItens(dados);
        }
      } catch (error) {
        setItens([]);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, [abaAtiva]);

  // Nova função para inscrever
  const inscreverNoDesafio = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${API_URL}/desafios/${id}/inscrever`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resposta.ok) {
            alert("Inscrito com sucesso! Agora já podes concluir.");
            window.location.reload();
        } else {
            alert("Erro ao inscrever.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
  };

  const concluirDesafio = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const resposta = await fetch(`${API_URL}/desafios/${id}/concluir`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_desafio: id }) 
      });

      if (resposta.ok) {
        alert("Desafio concluído com sucesso!");
        window.location.reload(); 
      } else {
        const erro = await resposta.json();
        alert(`Erro: ${erro.erro || 'Falha ao concluir'}`);
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="ranking-page-wrapper">
      <Header
        telaAtiva="atividades"
        onIrParaDashboard={onIrParaDashboard}
        onIrParaRanking={onIrParaRanking}
        onIrParaAtividades={() => {}}
        onVerPerfil={() => onVerPerfil(null)}
      />

      <div className="ranking-container">
        <h2>🎯 Central de Atividades</h2>
        <div className="ranking-list">
          {carregando ? <p>Carregando...</p> : itens.map((item) => (
              <div key={item.id_desafio || item.id} className="ranking-card" style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
                <span className="ranking-name">{item.nome || item.titulo}</span>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    {/* Botão de Inscrever */}
                    <button onClick={() => inscreverNoDesafio(item.id_desafio || item.id)} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#3498db', color: 'white' }}>
                        Inscrever
                    </button>
                    {/* Botão de Concluir */}
                    <button onClick={() => concluirDesafio(item.id_desafio || item.id)} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#4CAF50', color: 'white' }}>
                        Concluir
                    </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Atividades;
