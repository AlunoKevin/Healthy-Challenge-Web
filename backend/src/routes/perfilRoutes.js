const express = require('express');
const router = express.Router();

const perfilController = require('../controllers/perfilController');
const autenticacao = require('../middlewares/autenticacao');

// visualizar o proprio perfil
router.get('/', autenticacao, perfilController.buscarPerfil);

// atualizar perfil
router.put('/', autenticacao, perfilController.atualizarPerfil);

// visualizar o perfil de outro usuario (amigo, ranking, etc)
router.get('/:id', autenticacao, perfilController.buscarPerfilPorId);

module.exports = router;