const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

// gera token jwt com tipo admin
function gerarTokenAdmin(admin) {
  const payload = { id_administrador: admin.id_administrador, email: admin.email, tipo: 'admin' };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });
}

// valida email, senha e chave de acesso do administrador e devolve token
async function loginAdmin(email, senha, chave) {
  const admin = await adminModel.buscarAdminPorEmail(email);
  if (!admin) {
    const erro = new Error('credenciais invalidas');
    erro.status = 401;
    throw erro;
  }

  const senhaConfere = await bcrypt.compare(senha, admin.senha);
  if (!senhaConfere) {
    const erro = new Error('credenciais invalidas');
    erro.status = 401;
    throw erro;
  }

  if (chave !== admin.chave_de_acesso) {
    const erro = new Error('credenciais invalidas');
    erro.status = 401;
    throw erro;
  }

  const token = gerarTokenAdmin(admin);
  return { token };
}

module.exports = { loginAdmin };
