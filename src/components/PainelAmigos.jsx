import "../styles/PainelAmigos.css";

function obterIniciais(nome) {
  if (!nome) return "?";
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export default function PainelAmigos({ amigos, onFechar, onVerPerfil }) {
  return (
    <div className="amigos-overlay" onClick={onFechar}>
      <div
        className="amigos-painel"
        role="dialog"
        aria-modal="true"
        aria-label="Lista de amigos"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="amigos-painel-header">
          <h2>Amigos</h2>
          <button
            type="button"
            className="amigos-fechar-btn"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="amigos-lista">
          {amigos.length === 0 ? (
            <p className="amigos-vazio">Você ainda não tem amigos adicionados.</p>
          ) : (
            amigos.map((amigo) => (
              <button
                type="button"
                key={amigo.id_usuario}
                className="amigo-item"
                onClick={() => onVerPerfil({ id: amigo.id_usuario, nome: amigo.nome })}
              >
                <div className="amigo-avatar">
                  {amigo.foto_url ? (
                    <img src={amigo.foto_url} alt={`Foto de ${amigo.nome}`} />
                  ) : (
                    <span>{obterIniciais(amigo.nome)}</span>
                  )}
                </div>
                <div className="amigo-info">
                  <span className="amigo-nome">{amigo.nome}</span>
                  <span className="amigo-email">{amigo.email}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
