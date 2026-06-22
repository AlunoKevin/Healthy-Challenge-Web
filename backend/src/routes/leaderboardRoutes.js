const express = require('express');
const router = express.Router();

const leaderboardModel = require('../models/leaderboard');

// converte um valor de query em inteiro positivo ou retorna undefined
function inteiroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}

// monta as opcoes de paginacao e filtros a partir da query string
function montarOpcoes(query) {
  const opcoes = {};
  const limite = inteiroPositivo(query.limit);
  const deslocamento = inteiroPositivo(query.offset);
  const idLiga = inteiroPositivo(query.liga);
  if (limite) opcoes.limite = limite;
  if (deslocamento) opcoes.deslocamento = deslocamento;
  if (idLiga) opcoes.idLiga = idLiga;
  // periodo so e aplicado quando as duas datas vem juntas
  if (query.inicio && query.fim) {
    opcoes.dataInicio = query.inicio;
    opcoes.dataFim = query.fim;
  }
  return opcoes;
}

router.get('/global', async (req, res) => {
  try {

    const ranking =
      await leaderboardModel.buscarLeaderboardGlobal(montarOpcoes(req.query));

    res.json(ranking);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: 'Erro ao buscar leaderboard'
    });
  }
});

router.get('/grupo/:idGrupo', async (req, res) => {
  try {

    const ranking =
      await leaderboardModel.buscarLeaderboardGrupo(
        req.params.idGrupo
      );

    res.json(ranking);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: 'Erro ao buscar leaderboard do grupo'
    });
  }
});

module.exports = router;