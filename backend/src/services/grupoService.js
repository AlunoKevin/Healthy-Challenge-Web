const grupoModel = require('../models/grupoModel');

// cria grupo; rejeita se nome nao for fornecido
async function criar(nome, descricao) {
  if (!nome || !nome.trim()) {
    const erro = new Error('nome e obrigatorio');
    erro.status = 400;
    throw erro;
  }
  return grupoModel.criar(nome.trim(), descricao || null);
}

// adiciona usuario ao grupo; rejeita se grupo nao existir
async function adicionarMembro(idGrupo, idUsuario) {
  const grupo = await grupoModel.buscarPorId(idGrupo);
  if (!grupo) {
    const erro = new Error('grupo nao encontrado');
    erro.status = 404;
    throw erro;
  }
  await grupoModel.adicionarMembro(idGrupo, idUsuario);
}

// remove usuario do grupo; so permite remover a si mesmo
async function removerMembro(idGrupo, idUsuario, idRequisitante) {
  if (idUsuario !== idRequisitante) {
    const erro = new Error('sem permissao para remover outro usuario');
    erro.status = 403;
    throw erro;
  }
  const grupo = await grupoModel.buscarPorId(idGrupo);
  if (!grupo) {
    const erro = new Error('grupo nao encontrado');
    erro.status = 404;
    throw erro;
  }
  const removidos = await grupoModel.removerMembro(idGrupo, idUsuario);
  if (removidos === 0) {
    const erro = new Error('usuario nao e membro do grupo');
    erro.status = 404;
    throw erro;
  }
}

module.exports = { criar, adicionarMembro, removerMembro };
