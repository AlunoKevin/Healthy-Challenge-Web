const perfilService = require('../services/perfilService');

// retorna todas as informacoes do perfil do usuario autenticado
async function buscarPerfil(req, res) {
  try {
    const perfil = await perfilService.buscarPerfil(req.usuario.id_usuario);
    return res.status(200).json(perfil);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// retorna o perfil publico de outro usuario (amigo, ranking, etc)
async function buscarPerfilPorId(req, res) {
  try {
    const perfil = await perfilService.buscarPerfil(req.params.id);
    return res.status(200).json(perfil);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// atualiza os dados editaveis do perfil
async function atualizarPerfil(req, res) {
  try {
    const perfilAtualizado = await perfilService.atualizarPerfil(
      req.usuario.id_usuario,
      req.body
    );

    return res.status(200).json(perfilAtualizado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

module.exports = {
  buscarPerfil,
  buscarPerfilPorId,
  atualizarPerfil
};