import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import PainelAmigos from "./PainelAmigos";
import "../styles/Ranking.css";
import "../styles/Perfil.css";

const API_URL = "http://localhost:3001";
const TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024; // 2MB

function obterIniciais(nome) {
  if (!nome) return "?";
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export default function Perfil({ usuarioRanking, onIrParaDashboard, onIrParaRanking, onIrParaAtividades, onVerPerfil }) {
  let usuarioLogado = {};
  try {
    const cache = localStorage.getItem("usuario");
    if (cache && cache !== "undefined") {
      usuarioLogado = JSON.parse(cache);
    }
  } catch (e) {
    console.error("Erro ao ler utilizador:", e);
  }

  const meuId = String(usuarioLogado.id_usuario ?? usuarioLogado.id ?? "");
  const perfilId = String(usuarioRanking?.id ?? meuId);
  const isOwnProfile = !usuarioRanking || perfilId === meuId;

  const nome = isOwnProfile
    ? usuarioLogado.nome || usuarioRanking?.nome || "Você"
    : usuarioRanking?.nome || "Utilizador";

  const badge =
    usuarioRanking?.badge || usuarioLogado.nivel_dificuldade || "Atleta";
  const pontos = usuarioRanking?.pontos;
  const posicao = usuarioRanking?.posicao;
  const aba = usuarioRanking?.aba === "amigos" ? "Amigos" : "Global";

  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoDraft, setPhotoDraft] = useState(null);
  const [bio, setBio] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [amigos, setAmigos] = useState([]);
  const [mostrarAmigos, setMostrarAmigos] = useState(false);
  const fileInputRef = useRef(null);

  // Se a pessoa navegar de um perfil para outro, reseta o estado local
  // e busca os dados reais do proprio perfil no backend.
  useEffect(() => {
    setPhotoUrl(null);
    setPhotoDraft(null);
    setBio("");
    setBioDraft("");
    setIsEditingBio(false);
    setMensagem("");
    setErro("");
    setAmigos([]);
    setMostrarAmigos(false);

    if (!isOwnProfile) return;

    async function buscarPerfil() {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(`${API_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resposta.ok) return;
        const dados = await resposta.json();
        setBio(dados.bio || "");
        setBioDraft(dados.bio || "");
        setPhotoUrl(dados.foto_url || null);
        setAmigos(dados.amigos || []);
        sincronizarFotoNoCache(dados.foto_url || null);
      } catch (e) {
        // mantem os campos vazios se a busca falhar
      }
    }
    buscarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfilId]);

  // mantem o cache local (usado pelo Header) sincronizado com a foto real
  function sincronizarFotoNoCache(fotoUrl) {
    try {
      const cache = JSON.parse(localStorage.getItem("usuario")) || {};
      localStorage.setItem("usuario", JSON.stringify({ ...cache, foto_url: fotoUrl }));
    } catch (e) {
      // se o cache estiver corrompido, ignora a sincronizacao
    }
  }

  async function salvarNoBackend(dados) {
    const token = localStorage.getItem("token");
    const resposta = await fetch(`${API_URL}/perfil`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) {
      const erroResposta = await resposta.json().catch(() => ({}));
      throw new Error(erroResposta.erro || "Não foi possível salvar.");
    }
    return resposta.json();
  }

  /* ===================== FOTO ===================== */
  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > TAMANHO_MAXIMO_FOTO) {
      setErro("A foto deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoDraft(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePhoto() {
    setMensagem("");
    setErro("");
    try {
      await salvarNoBackend({ foto_url: photoDraft });
      setPhotoUrl(photoDraft);
      setPhotoDraft(null);
      sincronizarFotoNoCache(photoDraft);
      setMensagem("Foto atualizada com sucesso.");
    } catch (e) {
      setErro(e.message || "Erro ao salvar a foto.");
    }
  }

  function handleCancelPhoto() {
    setPhotoDraft(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ===================== BIO ===================== */
  async function handleSaveBio() {
    setMensagem("");
    setErro("");
    try {
      const bioLimpa = bioDraft.trim();
      await salvarNoBackend({ bio: bioLimpa });
      setBio(bioLimpa);
      setIsEditingBio(false);
      setMensagem("Descrição atualizada com sucesso.");
    } catch (e) {
      setErro(e.message || "Erro ao salvar a descrição.");
    }
  }

  function handleCancelBio() {
    setBioDraft(bio);
    setIsEditingBio(false);
  }

  return (
    <div className="ranking-page-wrapper">
      <Header
        telaAtiva="perfil"
        onIrParaDashboard={onIrParaDashboard}
        onIrParaRanking={onIrParaRanking}
        onIrParaAtividades={onIrParaAtividades}
        onVerPerfil={() => onVerPerfil(null)}
      />

      <main className="profile-page">
        <section className="profile-card">
          <button type="button" className="voltar-btn" onClick={onIrParaRanking}>
            ← Voltar ao ranking
          </button>

          {/* ============ FOTO ============ */}
          <div className="profile-photo-wrap">
            <div className="profile-photo">
              {photoDraft || photoUrl ? (
                <img src={photoDraft || photoUrl} alt={`Foto de ${nome}`} />
              ) : (
                <span>{obterIniciais(nome)}</span>
              )}
            </div>

            {isOwnProfile && (
              <>
                <button
                  type="button"
                  className="edit-photo-btn"
                  title="Alterar foto de perfil"
                  onClick={handlePhotoClick}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" />
                    <path d="M16 6l-4-4-4 4" />
                    <path d="M12 2v14" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
              </>
            )}
          </div>

          {isOwnProfile && photoDraft && (
            <div className="bio-edit-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelPhoto}>
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={handleSavePhoto}>
                Salvar foto
              </button>
            </div>
          )}

          {mensagem && <p style={{ color: "#27ae60", textAlign: "center" }}>{mensagem}</p>}
          {erro && <p style={{ color: "#e74c3c", textAlign: "center" }}>{erro}</p>}

          {/* ============ NOME ============ */}
          <h1 className="profile-name">{nome}</h1>
          <span className="profile-badge">{badge}</span>

          {/* ============ BIO ============ */}
          <div className="profile-bio-wrap">
            {isEditingBio ? (
              <>
                <textarea
                  className="profile-bio-input"
                  maxLength={120}
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  autoFocus
                />
                <div className="bio-edit-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancelBio}>
                    Cancelar
                  </button>
                  <button type="button" className="btn-primary" onClick={handleSaveBio}>
                    Salvar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="profile-bio">
                  {bio || "Este usuário ainda não escreveu uma descrição."}
                </p>
                {isOwnProfile && (
                  <button
                    type="button"
                    className="edit-bio-btn"
                    onClick={() => setIsEditingBio(true)}
                  >
                    Editar descrição
                  </button>
                )}
              </>
            )}
          </div>

          {/* ============ ESTATÍSTICAS ============ */}
          <div className="ranking-summary">
            {posicao && (
              <div className="rank-pill">
                <span className="rank-pill__label">🏆 Posição no ranking {aba}</span>
                <span className="rank-pill__value">#{posicao}</span>
              </div>
            )}
            <div className="rank-pill">
              <span className="rank-pill__label">⭐ Pontuação</span>
              <span className="rank-pill__value">{pontos ?? "—"} pts</span>
            </div>
            <div className="rank-pill">
              <span className="rank-pill__label">🔥 Nível</span>
              <span className="rank-pill__value">{badge}</span>
            </div>
            {isOwnProfile && (
              <button
                type="button"
                className="rank-pill rank-pill--clicavel"
                onClick={() => setMostrarAmigos(true)}
              >
                <span className="rank-pill__label">👥 Amigos</span>
                <span className="rank-pill__value">{amigos.length}</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {mostrarAmigos && (
        <PainelAmigos
          amigos={amigos}
          onFechar={() => setMostrarAmigos(false)}
          onVerPerfil={(usuario) => {
            setMostrarAmigos(false);
            onVerPerfil(usuario);
          }}
        />
      )}
    </div>
  );
}
