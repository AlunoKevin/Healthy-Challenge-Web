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

module.exports = { cadastrar };
