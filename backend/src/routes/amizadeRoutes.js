const express = require('express');
const router = express.Router();

const amizadeController = require('../controllers/amizadeController');
const autenticacao = require('../middlewares/autenticacao');

// busca usuarios para adicionar como amigo
router.get('/buscar', autenticacao, amizadeController.buscarUsuarios);

// lista pedidos de amizade pendentes recebidos
router.get('/pendentes', autenticacao, amizadeController.listarPendentes);

// envia uma solicitacao de amizade
router.post('/', autenticacao, amizadeController.solicitar);

// aceita um pedido de amizade recebido
router.put('/:idOrigem/aceitar', autenticacao, amizadeController.aceitar);

// rejeita um pedido de amizade recebido
router.put('/:idOrigem/rejeitar', autenticacao, amizadeController.rejeitar);

module.exports = router;
