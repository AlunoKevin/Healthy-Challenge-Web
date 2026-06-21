const desafioService = require('../services/desafioService');

// retorna todos os desafios ativos
async function listar(req, res) {
  try {
    const desafios = await desafioService.listar();
    return res.status(200).json(desafios);
  } catch (erro) {
    return res.status(500).json({ erro: 'erro interno do servidor' });
  }
}

// retorna os desafios em que o usuario autenticado esta inscrito
async function meusDesafios(req, res) {
  try {
    const desafios = await desafioService.meusDesafios(req.usuario.id_usuario);
    return res.status(200).json(desafios);
  } catch (erro) {
    return res.status(500).json({ erro: 'erro interno do servidor' });
  }
}

// inscreve o usuario autenticado no desafio informado
async function inscrever(req, res) {
  try {
    const inscricao = await desafioService.inscrever(
      req.usuario.id_usuario,
      req.params.id
    );
    return res.status(201).json(inscricao);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// conclui o desafio para o usuario autenticado
async function concluir(req, res) {
  try {
    const conclusao = await desafioService.concluir(
      req.usuario.id_usuario,
      req.params.id
    );
    return res.status(200).json(conclusao);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// retorna os desafios concluidos pelo usuario autenticado
async function meusConcluidos(req, res) {
  try {
    const concluidos = await desafioService.meusConcluidos(req.usuario.id_usuario);
    return res.status(200).json(concluidos);
  } catch (erro) {
    return res.status(500).json({ erro: 'erro interno do servidor' });
  }
}

module.exports = { listar, meusDesafios, inscrever, concluir, meusConcluidos };
