import { useEffect, useRef, useState } from "react";
import "../styles/PainelAmigos.css";

const API_URL = "http://localhost:3001";

function obterIniciais(nome) {
  if (!nome) return "?";
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

function Avatar({ nome, fotoUrl }) {
  return (
    <div className="amigo-avatar">
      {fotoUrl ? (
        <img src={fotoUrl} alt={`Foto de ${nome}`} />
      ) : (
        <span>{obterIniciais(nome)}</span>
      )}
    </div>
  );
}

export default function PainelAmigos({ amigos, onFechar, onVerPerfil, onAmigosAtualizados }) {
  const [abaAtiva, setAbaAtiva] = useState("amigos");

  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [erroBusca, setErroBusca] = useState("");
  const debounceRef = useRef(null);

  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [erroPedidos, setErroPedidos] = useState("");

  function tokenAtual() {
    return localStorage.getItem("token");
  }

  async function buscarUsuarios(termo) {
    setErroBusca("");
    try {
      const resposta = await fetch(`${API_URL}/amizades/buscar?q=${encodeURIComponent(termo)}`, {
        headers: { Authorization: `Bearer ${tokenAtual()}` }
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível buscar usuários.");
      setResultadosBusca(dados);
    } catch (e) {
      setErroBusca(e.message || "Não foi possível buscar usuários.");
      setResultadosBusca([]);
    } finally {
      setCarregandoBusca(false);
    }
  }

  async function carregarPedidos() {
    setCarregandoPedidos(true);
    setErroPedidos("");
    try {
      const resposta = await fetch(`${API_URL}/amizades/pendentes`, {
        headers: { Authorization: `Bearer ${tokenAtual()}` }
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível carregar os pedidos.");
      setPedidos(dados);
    } catch (e) {
      setErroPedidos(e.message || "Não foi possível carregar os pedidos.");
    } finally {
      setCarregandoPedidos(false);
    }
  }

  // busca a contagem de pedidos pendentes assim que o painel abre, para mostrar o selo na aba
  useEffect(() => {
    carregarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const termo = termoBusca.trim();
    if (termo.length < 2) {
      setResultadosBusca([]);
      setErroBusca("");
      setCarregandoBusca(false);
      return;
    }

    setCarregandoBusca(true);
    debounceRef.current = setTimeout(() => buscarUsuarios(termo), 400);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termoBusca]);

  async function enviarSolicitacao(usuario) {
    try {
      const resposta = await fetch(`${API_URL}/amizades`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenAtual()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_usuario_destino: usuario.id_usuario })
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível enviar o pedido.");

      setResultadosBusca((atual) =>
        atual.map((item) =>
          item.id_usuario === usuario.id_usuario
            ? { ...item, relacionamento: "PENDENTE_ENVIADO" }
            : item
        )
      );
    } catch (e) {
      setErroBusca(e.message || "Não foi possível enviar o pedido.");
    }
  }

  async function responderPedido(idOrigem, acao) {
    try {
      const resposta = await fetch(`${API_URL}/amizades/${idOrigem}/${acao}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenAtual()}` }
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível responder ao pedido.");

      setPedidos((atual) => atual.filter((pedido) => pedido.id_usuario !== idOrigem));

      if (acao === "aceitar") {
        onAmigosAtualizados?.();
      }
    } catch (e) {
      setErroPedidos(e.message || "Não foi possível responder ao pedido.");
    }
  }

  function rotuloRelacionamento(relacionamento) {
    switch (relacionamento) {
      case "AMIGOS":
        return "Já são amigos";
      case "PENDENTE_ENVIADO":
        return "Pedido enviado";
      default:
        return null;
    }
  }

  return (
    <div className="amigos-overlay" onClick={onFechar}>
      <div
        className="amigos-painel"
        role="dialog"
        aria-modal="true"
        aria-label="Painel de amigos"
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

        <div className="amigos-tabs">
          <button
            type="button"
            className={abaAtiva === "amigos" ? "amigos-tab active" : "amigos-tab"}
            onClick={() => setAbaAtiva("amigos")}
          >
            Amigos
          </button>
          <button
            type="button"
            className={abaAtiva === "adicionar" ? "amigos-tab active" : "amigos-tab"}
            onClick={() => setAbaAtiva("adicionar")}
          >
            Adicionar
          </button>
          <button
            type="button"
            className={abaAtiva === "pedidos" ? "amigos-tab active" : "amigos-tab"}
            onClick={() => setAbaAtiva("pedidos")}
          >
            Pedidos
            {pedidos.length > 0 && <span className="amigos-tab-selo">{pedidos.length}</span>}
          </button>
        </div>

        {abaAtiva === "amigos" && (
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
                  <Avatar nome={amigo.nome} fotoUrl={amigo.foto_url} />
                  <div className="amigo-info">
                    <span className="amigo-nome">{amigo.nome}</span>
                    <span className="amigo-email">{amigo.email}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {abaAtiva === "adicionar" && (
          <div className="amigos-lista">
            <div className="amigos-busca">
              <input
                type="text"
                className="amigos-busca-input"
                placeholder="Buscar por nome ou e-mail..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                autoFocus
              />
            </div>

            {erroBusca && <p className="amigos-erro">{erroBusca}</p>}

            {carregandoBusca ? (
              <p className="amigos-vazio">Buscando...</p>
            ) : termoBusca.trim().length < 2 ? (
              <p className="amigos-vazio">Digite ao menos 2 caracteres para buscar.</p>
            ) : resultadosBusca.length === 0 ? (
              <p className="amigos-vazio">Nenhum usuário encontrado.</p>
            ) : (
              resultadosBusca.map((usuario) => (
                <div key={usuario.id_usuario} className="amigo-item amigo-item--busca">
                  <Avatar nome={usuario.nome} fotoUrl={usuario.foto_url} />
                  <div className="amigo-info">
                    <span className="amigo-nome">{usuario.nome}</span>
                    <span className="amigo-email">{usuario.email}</span>
                  </div>

                  {usuario.relacionamento === "NENHUMA" && (
                    <button
                      type="button"
                      className="amigo-acao-btn amigo-acao-btn--primaria"
                      onClick={() => enviarSolicitacao(usuario)}
                    >
                      Adicionar
                    </button>
                  )}

                  {usuario.relacionamento === "PENDENTE_RECEBIDO" && (
                    <button
                      type="button"
                      className="amigo-acao-btn amigo-acao-btn--primaria"
                      onClick={() => responderPedido(usuario.id_usuario, "aceitar")}
                    >
                      Aceitar
                    </button>
                  )}

                  {rotuloRelacionamento(usuario.relacionamento) && (
                    <span className="amigo-status">
                      {rotuloRelacionamento(usuario.relacionamento)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {abaAtiva === "pedidos" && (
          <div className="amigos-lista">
            {erroPedidos && <p className="amigos-erro">{erroPedidos}</p>}

            {carregandoPedidos ? (
              <p className="amigos-vazio">Carregando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <p className="amigos-vazio">Você não tem pedidos de amizade pendentes.</p>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id_usuario} className="amigo-item amigo-item--busca">
                  <Avatar nome={pedido.nome} fotoUrl={pedido.foto_url} />
                  <div className="amigo-info">
                    <span className="amigo-nome">{pedido.nome}</span>
                    <span className="amigo-email">{pedido.email}</span>
                  </div>
                  <div className="amigo-acoes">
                    <button
                      type="button"
                      className="amigo-acao-btn amigo-acao-btn--primaria"
                      onClick={() => responderPedido(pedido.id_usuario, "aceitar")}
                    >
                      Aceitar
                    </button>
                    <button
                      type="button"
                      className="amigo-acao-btn amigo-acao-btn--secundaria"
                      onClick={() => responderPedido(pedido.id_usuario, "rejeitar")}
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
