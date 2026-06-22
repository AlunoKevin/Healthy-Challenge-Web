const desafioService = require('../services/desafioService');

// verifica se o valor e um inteiro positivo valido
function idValido(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

// verifica se o valor e um numero positivo valido
function pontuacaoValida(valor) {
  return Number.isFinite(Number(valor)) && Number(valor) > 0;
}

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
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'id invalido' });
  }
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
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'id invalido' });
  }
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

// cria um novo desafio com validacao dos campos obrigatorios
async function criar(req, res) {
  const { titulo, descricao, pontuacao_prevista } = req.body;
  if (!titulo || !pontuacaoValida(pontuacao_prevista)) {
    return res.status(400).json({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  }
  try {
    const desafio = await desafioService.criar(titulo, descricao || null, pontuacao_prevista);
    return res.status(201).json(desafio);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// atualiza dados de um desafio existente
async function atualizar(req, res) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'id invalido' });
  }
  const { titulo, descricao, pontuacao_prevista } = req.body;
  if (!titulo || !pontuacaoValida(pontuacao_prevista)) {
    return res.status(400).json({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  }
  try {
    const desafio = await desafioService.atualizar(req.params.id, titulo, descricao || null, pontuacao_prevista);
    return res.status(200).json(desafio);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// inativa um desafio existente
async function inativar(req, res) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'id invalido' });
  }
  try {
    const desafio = await desafioService.inativar(req.params.id);
    return res.status(200).json(desafio);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

module.exports = { listar, meusDesafios, inscrever, concluir, meusConcluidos, criar, atualizar, inativar };
