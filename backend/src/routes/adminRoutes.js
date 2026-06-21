const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autorizacaoAdmin = require('../middlewares/autorizacaoAdmin');

router.post('/login', adminController.login);

// rota protegida de exemplo: confirma que o admin esta autenticado
router.get('/status', autorizacaoAdmin, (req, res) => {
  res.status(200).json({ ok: true, admin: req.admin.email });
});

module.exports = router;
