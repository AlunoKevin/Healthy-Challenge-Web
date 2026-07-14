import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import "../styles/Ranking.css";
import "../styles/Perfil.css";

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
  const [bio, setBio] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const fileInputRef = useRef(null);

  // Se a pessoa navegar de um perfil para outro, reseta o estado local.
  useEffect(() => {
    setPhotoUrl(null);
    setBio("");
    setBioDraft("");
    setIsEditingBio(false);
  }, [perfilId]);

  /* ===================== FOTO ===================== */
  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      // TODO: enviar `file` para o backend (multipart/form-data) e salvar
      // a URL retornada, ex:
      // const url = await api.uploadProfilePhoto(file);
      // await api.updateProfile({ photoUrl: url });
    };
    reader.readAsDataURL(file);
  }

  /* ===================== BIO ===================== */
  function handleSaveBio() {
    setBio(bioDraft.trim());
    setIsEditingBio(false);
    // TODO: persistir no backend, ex:
    // api.updateProfile({ bio: bioDraft.trim() });
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
              {photoUrl ? (
                <img src={photoUrl} alt={`Foto de ${nome}`} />
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
          </div>
        </section>
      </main>
    </div>
  );
}
