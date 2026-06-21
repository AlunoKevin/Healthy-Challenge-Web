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

// limiares de liga em ordem decrescente de pontuacao [minimo, id_liga]
const LIMIARES = [
  [25000, 8],
  [15000, 7],
  [10000, 6],
  [6000,  5],
  [3000,  4],
  [1500,  3],
  [500,   2],
  [0,     1],
];

// determina id_liga pela pontuacao e atualiza o usuario no banco
async function atualizarLiga(idUsuario, pontuacaoTotal) {
  const idLiga = LIMIARES.find(([min]) => pontuacaoTotal >= min)[1];
  const sql = `
    UPDATE Usuario SET id_liga = $2
    WHERE id_usuario = $1
    RETURNING id_usuario, id_liga
  `;
  const resultado = await pool.query(sql, [idUsuario, idLiga]);
  return resultado.rows[0];
}

module.exports = { listar, buscarDoUsuario, atualizarLiga };
