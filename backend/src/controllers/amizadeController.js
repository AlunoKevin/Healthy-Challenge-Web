const amizadeService = require('../services/amizadeService');

// busca usuarios por nome/email para adicionar como amigo
async function buscarUsuarios(req, res) {
  try {
    const resultado = await amizadeService.buscarUsuarios(req.query.q, req.usuario.id_usuario);
    return res.status(200).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// envia uma solicitacao de amizade para outro usuario
async function solicitar(req, res) {
  try {
    const resultado = await amizadeService.solicitarAmizade(
      req.usuario.id_usuario,
      req.body.id_usuario_destino
    );
    return res.status(201).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// lista os pedidos de amizade pendentes recebidos pelo usuario autenticado
async function listarPendentes(req, res) {
  try {
    const resultado = await amizadeService.listarPendentes(req.usuario.id_usuario);
    return res.status(200).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// aceita um pedido de amizade recebido
async function aceitar(req, res) {
  try {
    const resultado = await amizadeService.aceitarAmizade(req.usuario.id_usuario, req.params.idOrigem);
    return res.status(200).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// rejeita um pedido de amizade recebido
async function rejeitar(req, res) {
  try {
    const resultado = await amizadeService.rejeitarAmizade(req.usuario.id_usuario, req.params.idOrigem);
    return res.status(200).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

module.exports = {
  buscarUsuarios,
  solicitar,
  listarPendentes,
  aceitar,
  rejeitar
};
