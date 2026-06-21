const adminService = require('../services/adminService');

// realiza login do administrador e retorna token jwt
async function login(req, res) {
  const { email, senha, chave_de_acesso } = req.body;

  if (!email || !senha || !chave_de_acesso) {
    return res.status(400).json({ erro: 'email, senha e chave_de_acesso sao obrigatorios' });
  }

  try {
    const resultado = await adminService.loginAdmin(email, senha, chave_de_acesso);
    return res.status(200).json(resultado);
  } catch (erro) {
    return res.status(erro.status || 500).json({
      erro: erro.status ? erro.message : 'erro interno do servidor'
    });
  }
}

module.exports = { login };
