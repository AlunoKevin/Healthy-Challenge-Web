const pool = require('../config/conexao');

// chama a view ja definida no BD para buscar o leaderboard global, ordenado por posicao
async function buscarLeaderboardGlobal() {
  const sql = `
    SELECT
      posicao,
      id_usuario,
      nome,
      pontuacao_total
    FROM mv_leaderboard_global
    ORDER BY posicao;
  `;

  const resultado = await pool.query(sql);

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