const leaderboardModel = require('../models/leaderboard');
const ligaModel = require('../models/ligaModel');

// monta as informacoes de ranking do usuario: posicao global, pontuacao e liga atual
async function rankingInfo(idUsuario) {
  const posicao = await leaderboardModel.buscarPosicaoDoUsuario(idUsuario);

  if (!posicao) {
    const erro = new Error('usuario nao encontrado no ranking');
    erro.status = 404;
    throw erro;
  }

  const liga = await ligaModel.buscarDoUsuario(idUsuario);

  return {
    posicao: posicao.posicao,
    pontuacao_total: posicao.pontuacao_total,
    liga
  };
}

module.exports = { rankingInfo };
