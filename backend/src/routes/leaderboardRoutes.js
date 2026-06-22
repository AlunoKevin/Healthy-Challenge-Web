const express = require('express');
const router = express.Router();

const leaderboardModel = require('../models/leaderboard');

router.get('/global', async (req, res) => {
  try {

    const limite = parseInt(req.query.limite) || 20;
    const deslocamento = parseInt(req.query.deslocamento) || 0;

    if (limite < 1 || deslocamento < 0) {
      return res.status(400).json({ erro: 'Parametros de paginacao invalidos' });
    }

    const ranking = await leaderboardModel.buscarLeaderboardGlobal({
      limite,
      deslocamento,
      idLiga: req.query.id_liga || null,
      dataInicio: req.query.data_inicio || null,
      dataFim: req.query.data_fim || null
    });

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