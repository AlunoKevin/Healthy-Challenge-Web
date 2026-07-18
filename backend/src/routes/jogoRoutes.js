const express = require('express');

const router = express.Router();

const jogoController =
require('../controllers/jogoController');

const autenticacao =
require('../middlewares/autenticacao');

router.post(
    '/iniciar',
    autenticacao,
    jogoController.iniciarPartida
);

router.post(
    '/jogada',
    autenticacao,
    jogoController.jogar
);

router.delete(
    '/',
    autenticacao,
    jogoController.abandonarPartida
);

module.exports = router;