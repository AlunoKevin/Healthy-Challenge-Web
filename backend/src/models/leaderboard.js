const pool = require('../config/conexao');

// busca o leaderboard global com paginacao e filtros opcionais
async function buscarLeaderboardGlobal(opcoes = {}) {
  const { limite = 20, deslocamento = 0, idLiga, dataInicio, dataFim } = opcoes;
  const temFiltro = idLiga || dataInicio || dataFim;

  if (!temFiltro) {
    const sql = `
      SELECT posicao, id_usuario, nome, pontuacao_total
      FROM mv_leaderboard_global
      ORDER BY posicao
      LIMIT $1 OFFSET $2
    `;
    const resultado = await pool.query(sql, [limite, deslocamento]);
    return resultado.rows;
  }

  const params = [];
  const condicoes = [];

  if (idLiga) {
    params.push(idLiga);
    condicoes.push(`u.id_liga = $${params.length}`);
  }
  if (dataInicio) {
    params.push(dataInicio);
    condicoes.push(`cd.data_conclusao >= $${params.length}`);
  }
  if (dataFim) {
    params.push(dataFim);
    condicoes.push(`cd.data_conclusao <= $${params.length}`);
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';
  params.push(limite, deslocamento);

  const sql = `
    SELECT
      u.id_usuario,
      u.nome,
      COALESCE(SUM(cd.pontuacao), 0) AS pontuacao_total,
      RANK() OVER (ORDER BY COALESCE(SUM(cd.pontuacao), 0) DESC) AS posicao
    FROM Usuario u
    LEFT JOIN Conclusao_Desafio cd ON u.id_usuario = cd.id_usuario
    ${where}
    GROUP BY u.id_usuario, u.nome
    ORDER BY posicao
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

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

module.exports = {
  buscarLeaderboardGlobal,
  buscarLeaderboardGrupo
};