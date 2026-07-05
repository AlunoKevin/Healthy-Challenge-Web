import { useState, useRef, useEffect } from "react";
import "../styles/Perfil.css";

const CURRENT_USER_ID = "me";

const MOCK_USERS = {
  me: {
    id: "me",
    name: "Ana Lima",
    initials: "AL",
    photoUrl: null,
    bio: "Correndo atrás de 5km todo dia 🏃‍♀️ Bora treinar junto!",
    globalRank: 1,
    friendsRank: 1,
  },
  "joao-silva": {
    id: "joao-silva",
    name: "João Silva",
    initials: "JS",
    photoUrl: null,
    bio: "Foco em musculação e consistência 💪",
    globalRank: 2,
    friendsRank: 2,
  },
  "pedro-costa": {
    id: "pedro-costa",
    name: "Pedro Costa",
    initials: "PC",
    photoUrl: null,
    bio: "Triatleta de fim de semana.",
    globalRank: 3,
    friendsRank: 3,
  },
};

export default function Perfil({ userId, onVoltar }) {
  const profileId = userId || CURRENT_USER_ID;
  const isOwnProfile = profileId === CURRENT_USER_ID;

  const profile = MOCK_USERS[profileId] || MOCK_USERS[CURRENT_USER_ID];

  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [bio, setBio] = useState(profile.bio);
  const [bioDraft, setBioDraft] = useState(profile.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const fileInputRef = useRef(null);

  // Se a pessoa navegar de um perfil para outro (troca de :userId),
  // reseta o estado local para os dados do novo perfil.
  useEffect(() => {
    setPhotoUrl(profile.photoUrl);
    setBio(profile.bio);
    setBioDraft(profile.bio);
    setIsEditingBio(false);
  }, [profileId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <main className="profile-page">
      <section className="profile-card">
        {onVoltar && (
          <button type="button" className="voltar-btn" onClick={onVoltar}>
            ← Voltar
          </button>
        )}

        {/* ============ FOTO ============ */}
        <div className="profile-photo-wrap">
          <div className="profile-photo">
            {photoUrl ? (
              <img src={photoUrl} alt={`Foto de ${profile.name}`} />
            ) : (
              <span>{profile.initials}</span>
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
        <h1 className="profile-name">{profile.name}</h1>

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

        {/* ============ RANKINGS ============ */}
        <div className="ranking-summary">
          <div className="rank-pill">
            <span className="rank-pill__label">🌍 Ranking Global</span>
            <span className="rank-pill__value">#{profile.globalRank}</span>
          </div>
          <div className="rank-pill">
            <span className="rank-pill__label">🤝 Ranking entre Amigos</span>
            <span className="rank-pill__value">#{profile.friendsRank}</span>
          </div>
        </div>
      </section>
    </main>
  );
}