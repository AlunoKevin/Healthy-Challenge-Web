const express = require('express');
const router = express.Router();

const perfilController = require('../controllers/perfilController');
const autenticacao = require('../middlewares/autenticacao');

// visualizar perfil
router.get('/', autenticacao, perfilController.buscarPerfil);

// atualizar perfil
router.put('/', autenticacao, perfilController.atualizarPerfil);

module.exports = router;