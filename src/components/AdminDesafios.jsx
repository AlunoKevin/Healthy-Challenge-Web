import React, { useState, useEffect } from 'react';
import '../styles/Ranking.css';

const API_URL = 'http://localhost:3001';

const FORM_VAZIO = { titulo: '', descricao: '', pontuacao_prevista: '', id_jogo: '' };

const AdminDesafios = ({ onLogout }) => {
  const [desafios, setDesafios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const adminEmail = localStorage.getItem('adminEmail') || 'Administrador';

  useEffect(() => {
    const buscarDesafios = async () => {
      setCarregando(true);
      setErro('');
      try {
        const resposta = await fetch(`${API_URL}/desafios`);
        if (!resposta.ok) {
          throw new Error('Erro ao carregar desafios.');
        }
        const dados = await resposta.json();
        setDesafios(dados);
      } catch (error) {
        setErro(error.message || 'Erro de conexão.');
      } finally {
        setCarregando(false);
      }
    };

    buscarDesafios();
  }, [refreshKey]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const abrirCriacao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setFormAberto(true);
    setMensagem('');
    setErro('');
  };

  const abrirEdicao = (desafio) => {
    const id = desafio.id_desafio || desafio.id;
    setEditandoId(id);
    setForm({
      titulo: desafio.titulo || '',
      descricao: desafio.descricao || '',
      pontuacao_prevista: desafio.pontuacao_prevista ?? '',
      id_jogo: desafio.id_jogo ?? ''
    });
    setFormAberto(true);
    setMensagem('');
    setErro('');
  };

  const fecharForm = () => {
    setFormAberto(false);
    setEditandoId(null);
    setForm(FORM_VAZIO);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro('');

    const token = localStorage.getItem('adminToken');
    const editando = Boolean(editandoId);

    try {
      const corpo = editando
        ? {
            titulo: form.titulo,
            descricao: form.descricao || null,
            pontuacao_prevista: Number(form.pontuacao_prevista)
          }
        : {
            titulo: form.titulo,
            descricao: form.descricao || null,
            pontuacao_prevista: Number(form.pontuacao_prevista),
            id_jogo: Number(form.id_jogo)
          };

      const resposta = await fetch(
        editando ? `${API_URL}/desafios/${editandoId}` : `${API_URL}/desafios`,
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(corpo)
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível salvar o desafio.');
      }

      setMensagem(editando ? 'Desafio atualizado com sucesso.' : 'Desafio criado com sucesso.');
      fecharForm();
      setRefreshKey((chave) => chave + 1);
    } catch (error) {
      setErro(error.message || 'Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const excluirDesafio = async (desafio) => {
    const id = desafio.id_desafio || desafio.id;
    const confirmado = window.confirm(`Excluir o desafio "${desafio.titulo}"?`);
    if (!confirmado) return;

    setMensagem('');
    setErro('');
    try {
      const token = localStorage.getItem('adminToken');
      const resposta = await fetch(`${API_URL}/desafios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => ({}));
        throw new Error(dadosErro.erro || 'Não foi possível excluir o desafio.');
      }

      setMensagem('Desafio excluído com sucesso.');
      setRefreshKey((chave) => chave + 1);
    } catch (error) {
      setErro(error.message || 'Erro de conexão.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    onLogout();
  };

  return (
    <div className="ranking-page-wrapper">
      <header className="ranking-header">
        <div className="header-left">
          <h1 className="logo">Painel do Administrador</h1>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{adminEmail}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: '#e74c3c',
              color: 'white'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="ranking-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>🎯 Gerenciar Desafios</h2>
          {!formAberto && (
            <button
              onClick={abrirCriacao}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: '#27ae60',
                color: 'white',
                fontWeight: 600
              }}
            >
              + Novo desafio
            </button>
          )}
        </div>

        {mensagem && <p style={{ color: '#27ae60', textAlign: 'center' }}>{mensagem}</p>}
        {erro && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{erro}</p>}

        {formAberto && (
          <form onSubmit={handleSubmit} className="auth-form" style={{ marginBottom: '30px' }}>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Título do desafio"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição do desafio"
              />
            </div>

            <div className="form-group">
              <label>Pontuação prevista</label>
              <input
                type="number"
                name="pontuacao_prevista"
                value={form.pontuacao_prevista}
                onChange={handleChange}
                placeholder="Ex: 100"
                min="1"
                step="any"
                required
              />
            </div>

            {!editandoId && (
              <div className="form-group">
                <label>ID do jogo</label>
                <input
                  type="number"
                  name="id_jogo"
                  value={form.id_jogo}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  min="1"
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-auth" disabled={salvando}>
                {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Criar desafio'}
              </button>
              <button
                type="button"
                onClick={fecharForm}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  background: '#fff'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="ranking-list">
          {carregando ? (
            <p>Carregando...</p>
          ) : desafios.length === 0 ? (
            <p>Nenhum desafio cadastrado.</p>
          ) : (
            desafios.map((desafio) => {
              const id = desafio.id_desafio || desafio.id;
              return (
                <div key={id} className="ranking-card" style={{ display: 'flex', alignItems: 'center', padding: '15px', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <span className="ranking-name" style={{ display: 'block' }}>{desafio.titulo}</span>
                    {desafio.descricao && (
                      <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{desafio.descricao}</span>
                    )}
                    <span style={{ fontSize: '0.85rem', color: '#27ae60', display: 'block' }}>
                      {desafio.pontuacao_prevista} pts
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => abrirEdicao(desafio)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: '#3498db',
                        color: 'white'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirDesafio(desafio)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        background: '#e74c3c',
                        color: 'white'
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDesafios;
