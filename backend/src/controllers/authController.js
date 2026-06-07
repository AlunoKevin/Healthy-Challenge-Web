const authService = require('../services/authService');

// valida os campos obrigatorios do cadastro
function validarCadastro(corpo) {
  if (!corpo.nome || !corpo.email || !corpo.senha) {
    return 'nome, email e senha sao obrigatorios';
  }
  if (!corpo.email.includes('@')) {
    return 'email invalido';
  }
  return null;
}

async function cadastrar(req, res) {
  const erroValidacao = validarCadastro(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const usuario = await authService.cadastrar(req.body);
    return res.status(201).json(usuario);
  } catch (erro) {
    const status = erro.status || 500;
    // nao vaza detalhe de erro interno para o cliente
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

// valida os campos obrigatorios do login
function validarLogin(corpo) {
  if (!corpo.email || !corpo.senha) {
    return 'email e senha sao obrigatorios';
  }
  return null;
}

async function login(req, res) {
  const erroValidacao = validarLogin(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const resultado = await authService.login(req.body.email, req.body.senha);
    return res.status(200).json(resultado);
  } catch (erro) {
    const status = erro.status || 500;
    const mensagem = status === 500 ? 'erro interno do servidor' : erro.message;
    return res.status(status).json({ erro: mensagem });
  }
}

module.exports = { cadastrar, login };
