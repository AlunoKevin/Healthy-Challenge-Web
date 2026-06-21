const pool = require('../config/conexao');

// retorna todos os desafios ativos
async function listarAtivos() {
  const sql = 'SELECT * FROM Desafio WHERE ativo = true';
  const resultado = await pool.query(sql);
  return resultado.rows;
}

// busca um desafio pelo id
async function buscarPorId(id) {
  const sql = 'SELECT * FROM Desafio WHERE id_desafio = $1';
  const resultado = await pool.query(sql, [id]);
  return resultado.rows[0] || null;
}

// inscreve o usuario em um desafio
async function inscrever(id_usuario, id_desafio) {
  const sql = `
    INSERT INTO Usuario_Desafio (id_usuario, id_desafio)
    VALUES ($1, $2)
    RETURNING id_usuario, id_desafio, data_inicio
  `;
  const resultado = await pool.query(sql, [id_usuario, id_desafio]);
  return resultado.rows[0];
}

// verifica se o usuario ja esta inscrito no desafio
async function jaInscrito(id_usuario, id_desafio) {
  const sql = `
    SELECT 1 FROM Usuario_Desafio
    WHERE id_usuario = $1 AND id_desafio = $2
  `;
  const resultado = await pool.query(sql, [id_usuario, id_desafio]);
  return resultado.rowCount > 0;
}

// registra a conclusao de um desafio com a pontuacao prevista
async function concluir(id_usuario, id_desafio, pontuacao) {
  const sql = `
    INSERT INTO Conclusao_Desafio (id_usuario, id_desafio, status, pontuacao, data_conclusao)
    VALUES ($1, $2, 'concluido', $3, CURRENT_TIMESTAMP)
    RETURNING id_conclusao, id_usuario, id_desafio, status, pontuacao, data_conclusao
  `;
  const resultado = await pool.query(sql, [id_usuario, id_desafio, pontuacao]);
  return resultado.rows[0];
}

// verifica se o usuario ja concluiu o desafio
async function jaConcluiu(id_usuario, id_desafio) {
  const sql = `
    SELECT 1 FROM Conclusao_Desafio
    WHERE id_usuario = $1 AND id_desafio = $2
  `;
  const resultado = await pool.query(sql, [id_usuario, id_desafio]);
  return resultado.rowCount > 0;
}

// retorna os desafios em que o usuario esta inscrito
async function buscarDoUsuario(id_usuario) {
  const sql = `
    SELECT d.id_desafio, d.titulo, d.descricao, d.pontuacao_prevista, d.ativo,
           ud.data_inicio
    FROM Desafio d
    JOIN Usuario_Desafio ud ON d.id_desafio = ud.id_desafio
    WHERE ud.id_usuario = $1
  `;
  const resultado = await pool.query(sql, [id_usuario]);
  return resultado.rows;
}

// retorna os desafios que o usuario ja concluiu
async function buscarConcluidosDoUsuario(id_usuario) {
  const sql = `
    SELECT d.id_desafio, d.titulo, d.descricao, d.pontuacao_prevista,
           cd.pontuacao, cd.data_conclusao
    FROM Desafio d
    JOIN Conclusao_Desafio cd ON d.id_desafio = cd.id_desafio
    WHERE cd.id_usuario = $1
    ORDER BY cd.data_conclusao DESC
  `;
  const resultado = await pool.query(sql, [id_usuario]);
  return resultado.rows;
}

// cria um novo desafio
async function criar(titulo, descricao, pontuacao_prevista) {
  const sql = `
    INSERT INTO Desafio (titulo, descricao, pontuacao_prevista, ativo)
    VALUES ($1, $2, $3, true)
    RETURNING *
  `;
  const resultado = await pool.query(sql, [titulo, descricao, pontuacao_prevista]);
  return resultado.rows[0];
}

// atualiza dados de um desafio existente
async function atualizar(id, titulo, descricao, pontuacao_prevista) {
  const sql = `
    UPDATE Desafio
    SET titulo = $1, descricao = $2, pontuacao_prevista = $3
    WHERE id_desafio = $4
    RETURNING *
  `;
  const resultado = await pool.query(sql, [titulo, descricao, pontuacao_prevista, id]);
  return resultado.rows[0] || null;
}

// marca um desafio como inativo (soft delete)
async function inativar(id) {
  const sql = `
    UPDATE Desafio SET ativo = false
    WHERE id_desafio = $1
    RETURNING *
  `;
  const resultado = await pool.query(sql, [id]);
  return resultado.rows[0] || null;
}

module.exports = { listarAtivos, buscarPorId, inscrever, jaInscrito, concluir, jaConcluiu, buscarDoUsuario, buscarConcluidosDoUsuario, criar, atualizar, inativar };
