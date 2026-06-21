const pool = require('../config/conexao');

// busca um usuario pelo email, retorna a linha ou undefined
async function buscarPorEmail(email) {
  const sql = 'SELECT * FROM Usuario WHERE email = $1';
  const resultado = await pool.query(sql, [email]);
  return resultado.rows[0];
}

// busca um usuario pelo id
async function buscarPorId(id) {
  const sql = 'SELECT * FROM Usuario WHERE id_usuario = $1';
  const resultado = await pool.query(sql, [id]);
  return resultado.rows[0];
}

// cria um usuario novo e retorna a linha criada sem o hash da senha
async function criar(usuario) {
  const sql = `
    INSERT INTO Usuario (nome, email, senha_hash, nivel_dificuldade, id_liga)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_usuario, nome, email, nivel_dificuldade, id_liga, data_cadastro
  `;
  const valores = [
    usuario.nome,
    usuario.email,
    usuario.senha_hash,
    usuario.nivel_dificuldade,
    usuario.id_liga
  ];
  const resultado = await pool.query(sql, valores);
  return resultado.rows[0];
}

// atualiza o ultimo acesso e a sequencia de dias consecutivos do usuario no login
async function atualizarUltimoAcesso(id) {
  const sql = `
    UPDATE Usuario
    SET
      dias_consecutivos = CASE
        WHEN ultimo_acesso IS NULL THEN 1
        WHEN ultimo_acesso::date = CURRENT_DATE THEN GREATEST(COALESCE(dias_consecutivos, 0), 1)
        WHEN ultimo_acesso::date = CURRENT_DATE - 1 THEN COALESCE(dias_consecutivos, 0) + 1
        ELSE 1
      END,
      ultimo_acesso = CURRENT_TIMESTAMP
    WHERE id_usuario = $1
  `;

  await pool.query(sql, [id]);
}

// busca estatisticas de pontuacao do usuario na view
async function buscarEstatisticas(id) {
  const sql = `
    SELECT desafios_concluidos, pontos_totais, media_pontos
    FROM vw_estatisticas_usuario
    WHERE id_usuario = $1
  `;
  const resultado = await pool.query(sql, [id]);
  return resultado.rows[0] || { desafios_concluidos: 0, pontos_totais: 0, media_pontos: null };
}

module.exports = { buscarPorEmail, buscarPorId, criar, atualizarUltimoAcesso, buscarEstatisticas };
