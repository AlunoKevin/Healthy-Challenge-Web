const pool = require('../config/conexao');

// busca o leaderboard global com paginacao e filtros opcionais (liga e periodo)
async function buscarLeaderboardGlobal(opcoes = {}) {
  const { idLiga, dataInicio, dataFim, limite, deslocamento } = opcoes;
  const params = [];
  let sql;

  // com periodo a view all-time nao serve, entao recalcula o ranking a partir das tabelas base
  if (dataInicio && dataFim) {
    params.push(dataInicio, dataFim);
    let filtroLiga = '';
    if (idLiga) {
      params.push(idLiga);
      filtroLiga = `WHERE u.id_liga = $${params.length}`;
    }
    sql = `
      SELECT u.id_usuario, u.nome,
             COALESCE(SUM(cd.pontuacao),0) AS pontuacao_total,
             RANK() OVER (ORDER BY COALESCE(SUM(cd.pontuacao),0) DESC) AS posicao
      FROM Usuario u
      LEFT JOIN Conclusao_Desafio cd
        ON u.id_usuario = cd.id_usuario
       AND cd.data_conclusao BETWEEN $1 AND $2
      ${filtroLiga}
      GROUP BY u.id_usuario, u.nome
      ORDER BY posicao
    `;
  } else if (idLiga) {
    // sem periodo: usa a view e junta com Usuario so para filtrar pela liga, mantendo a posicao global
    params.push(idLiga);
    sql = `
      SELECT mlg.posicao, mlg.id_usuario, mlg.nome, mlg.pontuacao_total
      FROM mv_leaderboard_global mlg
      JOIN Usuario u ON u.id_usuario = mlg.id_usuario
      WHERE u.id_liga = $1
      ORDER BY mlg.posicao
    `;
  } else {
    sql = `
      SELECT posicao, id_usuario, nome, pontuacao_total
      FROM mv_leaderboard_global
      ORDER BY posicao
    `;
  }

  if (limite) {
    params.push(limite);
    sql += ` LIMIT $${params.length}`;
  }
  if (deslocamento) {
    params.push(deslocamento);
    sql += ` OFFSET $${params.length}`;
  }

  const resultado = await pool.query(sql, params);

  return resultado.rows;
}

// chama a view ja definida no BD para buscar o leaderboard do grupo, ordenado por posicao_grupo
async function buscarLeaderboardGrupo(idGrupo) {
  const sql = `
    SELECT
      posicao_grupo,
      id_usuario,
      usuario,
      pontuacao_total
    FROM mv_leaderboard_grupo
    WHERE id_grupo = $1
    ORDER BY posicao_grupo;
  `;

  const resultado = await pool.query(sql, [idGrupo]);

  return resultado.rows;
}

// ranking entre o usuario e seus amigos aceitos; retorna [] quando ele nao tem amigos
async function buscarLeaderboardAmigos(idUsuario) {
  const sql = `
    WITH amigos AS (
      SELECT CASE
        WHEN a.id_usuario_origem = $1 THEN a.id_usuario_destino
        ELSE a.id_usuario_origem
      END AS id_usuario
      FROM Amizade a
      WHERE (a.id_usuario_origem = $1 OR a.id_usuario_destino = $1)
        AND a.status = 'ACEITA'
    ),
    participantes AS (
      SELECT id_usuario FROM amigos
      UNION
      SELECT $1 WHERE EXISTS (SELECT 1 FROM amigos)
    )
    SELECT
      u.id_usuario,
      u.nome,
      COALESCE(SUM(cd.pontuacao),0) AS pontuacao_total,
      RANK() OVER (
        ORDER BY COALESCE(SUM(cd.pontuacao),0) DESC
      ) AS posicao
    FROM participantes p
    JOIN Usuario u ON u.id_usuario = p.id_usuario
    LEFT JOIN Conclusao_Desafio cd ON cd.id_usuario = u.id_usuario
    GROUP BY u.id_usuario, u.nome
    ORDER BY posicao;
  `;

  const resultado = await pool.query(sql, [idUsuario]);

  return resultado.rows;
}

// busca a posicao e a pontuacao do usuario no ranking global
async function buscarPosicaoDoUsuario(idUsuario) {
  const sql = `
    SELECT posicao, pontuacao_total
    FROM mv_leaderboard_global
    WHERE id_usuario = $1;
  `;

  const resultado = await pool.query(sql, [idUsuario]);

  return resultado.rows[0] || null;
}

module.exports = {
  buscarLeaderboardGlobal,
  buscarLeaderboardGrupo,
  buscarLeaderboardAmigos,
  buscarPosicaoDoUsuario
};