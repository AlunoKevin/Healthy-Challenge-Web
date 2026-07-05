const usuarioService = require('../services/usuarioService');

// retorna posicao global, pontuacao e liga do usuario autenticado
async function rankingInfo(req, res) {
  try {
    const info = await usuarioService.rankingInfo(req.usuario.id_usuario);
    return res.status(200).json(info);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

module.exports = { rankingInfo };
