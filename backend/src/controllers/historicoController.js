const desafioService = require('../services/desafioService');

// retorna o historico de desafios concluidos pelo usuario autenticado
async function listar(req, res) {
  try {
    const historico = await desafioService.meusConcluidos(req.usuario.id_usuario);
    return res.status(200).json(historico);
  } catch (erro) {
    return res.status(500).json({ erro: 'erro interno do servidor' });
  }
}

module.exports = { listar };
