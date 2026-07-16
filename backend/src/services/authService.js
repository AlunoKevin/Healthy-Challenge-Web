const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// gera o token jwt com os dados basicos do usuario
function gerarToken(usuario) {
  const payload = { id_usuario: usuario.id_usuario, email: usuario.email };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '1d' }
  );
  return token;
}

// regra de login: confere email e senha e devolve o token e os dados do usuario
async function login(email, senha) {
  const usuario = await usuarioModel.buscarPorEmail(email);
  if (!usuario) {
    const erro = new Error('email ou senha invalidos');
    erro.status = 401;
    throw erro;
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) {
    const erro = new Error('email ou senha invalidos');
    erro.status = 401;
    throw erro;
  }

  await usuarioModel.atualizarUltimoAcesso(usuario.id_usuario);

  const token = gerarToken(usuario);
  const dadosUsuario = {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    nivel_dificuldade: usuario.nivel_dificuldade,
    id_liga: usuario.id_liga,
    liga: usuario.liga,
    foto_url: usuario.foto_url
  };
  return { token: token, usuario: dadosUsuario };
}

module.exports = { getHashSenha, cadastrar, gerarToken, login };
