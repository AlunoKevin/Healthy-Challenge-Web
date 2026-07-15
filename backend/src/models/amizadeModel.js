const pool = require('../config/conexao');

// busca usuarios pelo nome ou email, trazendo o status de amizade com quem esta logado
async function buscarUsuarios(termo, idUsuarioLogado) {
  const sql = `
    SELECT
      u.id_usuario,
      u.nome,
      u.email,
      u.foto_url,
      a.status,
      a.id_usuario_origem

    FROM Usuario u

    LEFT JOIN Amizade a
      ON (a.id_usuario_origem = $2 AND a.id_usuario_destino = u.id_usuario)
      OR (a.id_usuario_origem = u.id_usuario AND a.id_usuario_destino = $2)

    WHERE u.id_usuario <> $2
      AND (u.nome ILIKE $1 OR u.email ILIKE $1)

    ORDER BY u.nome
    LIMIT 20
  `;

  const resultado = await pool.query(sql, [`%${termo}%`, idUsuarioLogado]);

  return resultado.rows;
}

// busca a amizade existente entre dois usuarios, em qualquer direcao
async function buscarEntre(idA, idB) {
  const sql = `
    SELECT id_usuario_origem, id_usuario_destino, status
    FROM Amizade
    WHERE (id_usuario_origem = $1 AND id_usuario_destino = $2)
       OR (id_usuario_origem = $2 AND id_usuario_destino = $1)
  `;

  const resultado = await pool.query(sql, [idA, idB]);

  return resultado.rows[0] || null;
}

// cria uma solicitacao de amizade pendente
async function solicitar(idOrigem, idDestino) {
  const sql = `
    INSERT INTO Amizade (id_usuario_origem, id_usuario_destino, data_solicitacao, status)
    VALUES ($1, $2, CURRENT_TIMESTAMP, 'PENDENTE')
    RETURNING id_usuario_origem, id_usuario_destino, status, data_solicitacao
  `;

  const resultado = await pool.query(sql, [idOrigem, idDestino]);

  return resultado.rows[0];
}

// reabre, como pendente, uma amizade ja existente entre os dois usuarios (ex: apos rejeicao)
async function reenviar(idOrigem, idDestino) {
  const sql = `
    UPDATE Amizade
    SET
      id_usuario_origem = $1,
      id_usuario_destino = $2,
      status = 'PENDENTE',
      data_solicitacao = CURRENT_TIMESTAMP,
      data_aceitar = NULL
    WHERE (id_usuario_origem = $1 AND id_usuario_destino = $2)
       OR (id_usuario_origem = $2 AND id_usuario_destino = $1)
    RETURNING id_usuario_origem, id_usuario_destino, status, data_solicitacao
  `;

  const resultado = await pool.query(sql, [idOrigem, idDestino]);

  return resultado.rows[0];
}

// lista os pedidos de amizade pendentes recebidos pelo usuario
async function buscarPendentesRecebidos(idUsuario) {
  const sql = `
    SELECT
      u.id_usuario,
      u.nome,
      u.email,
      u.foto_url,
      a.data_solicitacao

    FROM Amizade a

    JOIN Usuario u
      ON u.id_usuario = a.id_usuario_origem

    WHERE a.id_usuario_destino = $1
      AND a.status = 'PENDENTE'

    ORDER BY a.data_solicitacao DESC
  `;

  const resultado = await pool.query(sql, [idUsuario]);

  return resultado.rows;
}

// aceita um pedido de amizade pendente
async function aceitar(idOrigem, idDestino) {
  const sql = `
    UPDATE Amizade
    SET status = 'ACEITA', data_aceitar = CURRENT_TIMESTAMP
    WHERE id_usuario_origem = $1
      AND id_usuario_destino = $2
      AND status = 'PENDENTE'
    RETURNING id_usuario_origem, id_usuario_destino, status
  `;

  const resultado = await pool.query(sql, [idOrigem, idDestino]);

  return resultado.rows[0] || null;
}

// rejeita um pedido de amizade pendente
async function rejeitar(idOrigem, idDestino) {
  const sql = `
    UPDATE Amizade
    SET status = 'REJEITADA'
    WHERE id_usuario_origem = $1
      AND id_usuario_destino = $2
      AND status = 'PENDENTE'
    RETURNING id_usuario_origem, id_usuario_destino, status
  `;

  const resultado = await pool.query(sql, [idOrigem, idDestino]);

  return resultado.rows[0] || null;
}

module.exports = {
  buscarUsuarios,
  buscarEntre,
  solicitar,
  reenviar,
  buscarPendentesRecebidos,
  aceitar,
  rejeitar
};
