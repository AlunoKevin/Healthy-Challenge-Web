const pool = require('../config/conexao');

// lista todas as ligas ordenadas por id
async function listar() {
  const sql = 'SELECT id_liga, nome, descricao FROM Liga ORDER BY id_liga';
  const resultado = await pool.query(sql);
  return resultado.rows;
}

// busca a liga atual do usuario via join com a tabela Usuario
async function buscarDoUsuario(idUsuario) {
  const sql = `
    SELECT l.id_liga, l.nome, l.descricao
    FROM Liga l
    JOIN Usuario u ON u.id_liga = l.id_liga
    WHERE u.id_usuario = $1
  `;
  const resultado = await pool.query(sql, [idUsuario]);
  return resultado.rows[0];
}

module.exports = { listar, buscarDoUsuario };
