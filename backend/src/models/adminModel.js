const pool = require('../config/conexao');

// busca um administrador pelo email, retorna a linha ou undefined
async function buscarAdminPorEmail(email) {
  const sql = 'SELECT * FROM Administrador WHERE email = $1';
  const resultado = await pool.query(sql, [email]);
  return resultado.rows[0];
}

module.exports = { buscarAdminPorEmail };
