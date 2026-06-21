const express = require('express');
const router = express.Router();
const ligaController = require('../controllers/ligaController');
const autenticacao = require('../middlewares/autenticacao');

router.get('/', ligaController.listar);
router.get('/minha', autenticacao, ligaController.minhaLiga);

module.exports = router;
