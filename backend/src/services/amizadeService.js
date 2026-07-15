const amizadeModel = require('../models/amizadeModel');
const usuarioModel = require('../models/usuarioModel');

// calcula, do ponto de vista de quem esta logado, a relacao com o usuario da linha buscada
function calcularRelacionamento(linha, idUsuarioLogado) {
  if (!linha.status || linha.status === 'REJEITADA') return 'NENHUMA';
  if (linha.status === 'ACEITA') return 'AMIGOS';
  if (linha.status === 'PENDENTE') {
    return String(linha.id_usuario_origem) === String(idUsuarioLogado)
      ? 'PENDENTE_ENVIADO'
      : 'PENDENTE_RECEBIDO';
  }
  return 'NENHUMA';
}

async function buscarUsuarios(termo, idUsuarioLogado) {
  const termoLimpo = (termo || '').trim();

  if (termoLimpo.length < 2) {
    const erro = new Error('informe ao menos 2 caracteres para buscar');
    erro.status = 400;
    throw erro;
  }

  const linhas = await amizadeModel.buscarUsuarios(termoLimpo, idUsuarioLogado);

  return linhas.map((linha) => ({
    id_usuario: linha.id_usuario,
    nome: linha.nome,
    email: linha.email,
    foto_url: linha.foto_url,
    relacionamento: calcularRelacionamento(linha, idUsuarioLogado)
  }));
}

async function solicitarAmizade(idOrigem, idDestino) {
  if (String(idOrigem) === String(idDestino)) {
    const erro = new Error('não é possível adicionar você mesmo como amigo');
    erro.status = 400;
    throw erro;
  }

  const destino = await usuarioModel.buscarPorId(idDestino);
  if (!destino) {
    const erro = new Error('usuário não encontrado');
    erro.status = 404;
    throw erro;
  }

  const existente = await amizadeModel.buscarEntre(idOrigem, idDestino);

  if (existente?.status === 'ACEITA') {
    const erro = new Error('vocês já são amigos');
    erro.status = 409;
    throw erro;
  }

  if (existente?.status === 'PENDENTE') {
    const erro = new Error('já existe uma solicitação pendente entre vocês');
    erro.status = 409;
    throw erro;
  }

  if (existente?.status === 'REJEITADA') {
    return amizadeModel.reenviar(idOrigem, idDestino);
  }

  return amizadeModel.solicitar(idOrigem, idDestino);
}

async function listarPendentes(idUsuario) {
  return amizadeModel.buscarPendentesRecebidos(idUsuario);
}

async function aceitarAmizade(idUsuarioLogado, idOrigem) {
  const resultado = await amizadeModel.aceitar(idOrigem, idUsuarioLogado);

  if (!resultado) {
    const erro = new Error('solicitação de amizade não encontrada');
    erro.status = 404;
    throw erro;
  }

  return resultado;
}

async function rejeitarAmizade(idUsuarioLogado, idOrigem) {
  const resultado = await amizadeModel.rejeitar(idOrigem, idUsuarioLogado);

  if (!resultado) {
    const erro = new Error('solicitação de amizade não encontrada');
    erro.status = 404;
    throw erro;
  }

  return resultado;
}

module.exports = {
  buscarUsuarios,
  solicitarAmizade,
  listarPendentes,
  aceitarAmizade,
  rejeitarAmizade
};
