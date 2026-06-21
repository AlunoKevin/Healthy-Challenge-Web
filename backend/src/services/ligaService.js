const ligaModel = require('../models/ligaModel');

// retorna todas as ligas cadastradas
async function listar() {
  return ligaModel.listar();
}

// retorna a liga atual do usuario ou lanca 404
async function buscarMinhaLiga(idUsuario) {
  const liga = await ligaModel.buscarDoUsuario(idUsuario);
  if (!liga) {
    const erro = new Error('liga nao encontrada');
    erro.status = 404;
    throw erro;
  }
  return liga;
}

// atualiza a liga do usuario com base na pontuacao total
async function atualizarProgressao(idUsuario, pontuacaoTotal) {
  return ligaModel.atualizarLiga(idUsuario, pontuacaoTotal);
}

module.exports = { listar, buscarMinhaLiga, atualizarProgressao };
