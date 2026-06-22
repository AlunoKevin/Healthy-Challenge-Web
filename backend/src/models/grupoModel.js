const pool = require('../config/conexao');

// insere novo grupo e retorna o registro criado
async function criar(nome, descricao) {
  const sql = `
    INSERT INTO Grupo (nome, descricao)
    VALUES ($1, $2)
    RETURNING id_grupo, nome, descricao
  `;
  const resultado = await pool.query(sql, [nome, descricao]);
  return resultado.rows[0];
}

// busca grupo pelo id
async function buscarPorId(idGrupo) {
  const sql = `SELECT id_grupo, nome, descricao FROM Grupo WHERE id_grupo = $1`;
  const resultado = await pool.query(sql, [idGrupo]);
  return resultado.rows[0];
}

// adiciona usuario ao grupo, ignora duplicata
async function adicionarMembro(idGrupo, idUsuario) {
  const sql = `
    INSERT INTO Usuario_Grupo (id_usuario, id_grupo)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;
  await pool.query(sql, [idUsuario, idGrupo]);
}

// remove usuario do grupo e retorna quantidade de linhas removidas
async function removerMembro(idGrupo, idUsuario) {
  const sql = `DELETE FROM Usuario_Grupo WHERE id_usuario = $1 AND id_grupo = $2`;
  const resultado = await pool.query(sql, [idUsuario, idGrupo]);
  return resultado.rowCount;
}

module.exports = { criar, buscarPorId, adicionarMembro, removerMembro };
