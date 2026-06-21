const express = require('express');
const desafioController = require('../controllers/desafioController');
const autenticacao = require('../middlewares/autenticacao');

const router = express.Router();

router.get('/', desafioController.listar);
router.get('/meus', autenticacao, desafioController.meusDesafios);
router.get('/concluidos', autenticacao, desafioController.meusConcluidos);
router.post('/:id/inscrever', autenticacao, desafioController.inscrever);
router.post('/:id/concluir', autenticacao, desafioController.concluir);

module.exports = router;
