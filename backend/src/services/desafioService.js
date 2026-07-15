const desafioModel = require('../models/desafioModel');

// retorna todos os desafios ativos
async function listar() {
  return desafioModel.listarAtivos();
}

// inscreve o usuario no desafio apos verificar existencia e duplicata
async function inscrever(id_usuario, id_desafio) {
  const desafio = await desafioModel.buscarPorId(id_desafio);
  if (!desafio) {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    throw erro;
  }

  const inscrito = await desafioModel.jaInscrito(id_usuario, id_desafio);
  if (inscrito) {
    const erro = new Error('usuario ja inscrito neste desafio');
    erro.status = 409;
    throw erro;
  }

  return desafioModel.inscrever(id_usuario, id_desafio);
}

// conclui o desafio usando a pontuacao prevista apos verificar inscricao e duplicata
async function concluir(id_usuario, id_desafio) {
  const desafio = await desafioModel.buscarPorId(id_desafio);
  if (!desafio) {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    throw erro;
  }

  if (!desafio.ativo) {
    const erro = new Error('desafio inativo');
    erro.status = 400;
    throw erro;
  }

  const inscrito = await desafioModel.jaInscrito(id_usuario, id_desafio);
  if (!inscrito) {
    const erro = new Error('usuario nao esta inscrito neste desafio');
    erro.status = 400;
    throw erro;
  }

  const concluido = await desafioModel.jaConcluiu(id_usuario, id_desafio);
  if (concluido) {
    const erro = new Error('desafio ja concluido');
    erro.status = 409;
    throw erro;
  }

  return desafioModel.concluir(id_usuario, id_desafio, desafio.pontuacao_prevista);
}

// retorna os desafios em que o usuario esta inscrito
async function meusDesafios(id_usuario) {
  return desafioModel.buscarDoUsuario(id_usuario);
}

// retorna os desafios concluidos pelo usuario
async function meusConcluidos(id_usuario) {
  return desafioModel.buscarConcluidosDoUsuario(id_usuario);
}

// cria um novo desafio apos validar campos obrigatorios
async function criar(titulo, descricao, pontuacao_prevista, id_jogo, id_administrador) {
  if (!titulo) {
    const erro = new Error('titulo e obrigatorio');
    erro.status = 400;
    throw erro;
  }
  if (pontuacao_prevista === null || pontuacao_prevista === undefined) {
    const erro = new Error('pontuacao_prevista e obrigatoria');
    erro.status = 400;
    throw erro;
  }
  if (id_jogo === null || id_jogo === undefined) {
    const erro = new Error('id_jogo e obrigatorio');
    erro.status = 400;
    throw erro;
  }
  return desafioModel.criar(titulo, descricao, pontuacao_prevista, id_jogo, id_administrador);
}

// atualiza desafio apos verificar se existe
async function atualizar(id, titulo, descricao, pontuacao_prevista) {
  const desafio = await desafioModel.buscarPorId(id);
  if (!desafio) {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    throw erro;
  }
  return desafioModel.atualizar(id, titulo, descricao, pontuacao_prevista);
}

// inativa desafio apos verificar se existe
async function inativar(id) {
  const desafio = await desafioModel.buscarPorId(id);
  if (!desafio) {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    throw erro;
  }
  return desafioModel.inativar(id);
}

module.exports = { listar, inscrever, concluir, meusDesafios, meusConcluidos, criar, atualizar, inativar };
