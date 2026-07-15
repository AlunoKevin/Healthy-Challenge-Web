const express = require('express');
const router = express.Router();

const historicoController = require('../controllers/historicoController');
const autenticacao = require('../middlewares/autenticacao');

router.get('/', autenticacao, historicoController.listar);

module.exports = router;
