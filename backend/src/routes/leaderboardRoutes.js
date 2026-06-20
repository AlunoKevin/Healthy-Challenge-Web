const express = require('express');
const router = express.Router();

const leaderboardModel = require('../models/leaderboard');

router.get('/global', async (req, res) => {
  try {

    const ranking =
      await leaderboardModel.buscarLeaderboardGlobal();

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