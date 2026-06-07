const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

// gera o hash da senha usando bcrypt
async function getHashSenha(senha) {
  const aux = await bcrypt.hash(senha, 10);
  return aux;
}

// regra de cadastro: verifica email duplicado, gera o hash e salva o usuario
async function cadastrar(dados) {
  const existente = await usuarioModel.buscarPorEmail(dados.email);
  if (existente) {
    const erro = new Error('email ja cadastrado');
    erro.status = 409;
    throw erro;
  }

  const senha_hash = await getHashSenha(dados.senha);

  const novo = {
    nome: dados.nome,
    email: dados.email,
    senha_hash: senha_hash,
    nivel_dificuldade: dados.nivel_dificuldade || 'F',
    id_liga: 1
  };

  const usuario = await usuarioModel.criar(novo);
  return usuario;
}

module.exports = { getHashSenha, cadastrar };
