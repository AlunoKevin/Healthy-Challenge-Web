const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticacao = require('../middlewares/autenticacao');

router.get('/ranking-info', autenticacao, usuarioController.rankingInfo);

module.exports = router;
