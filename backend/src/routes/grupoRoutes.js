const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const autenticacao = require('../middlewares/autenticacao');

router.post('/', autenticacao, grupoController.criar);
router.post('/:id/membros', autenticacao, grupoController.adicionarMembro);
router.delete('/:id/membros/:userId', autenticacao, grupoController.removerMembro);

module.exports = router;
