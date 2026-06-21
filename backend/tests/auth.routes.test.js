process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const usuarioModel = require('../src/models/usuarioModel');

jest.mock('../src/models/usuarioModel');

describe('POST /auth/cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 201 ao cadastrar', async () => {
    usuarioModel.buscarPorEmail.mockResolvedValue(undefined);
    usuarioModel.criar.mockResolvedValue({ id_usuario: 1, nome: 'ana', email: 'a@a.com' });

    const resposta = await request(app)
      .post('/auth/cadastro')
      .send({ nome: 'ana', email: 'a@a.com', senha: '123456' });

    expect(resposta.status).toBe(201);
    expect(resposta.body.id_usuario).toBe(1);
  });

  test('retorna 400 quando falta a senha', async () => {
    const resposta = await request(app)
      .post('/auth/cadastro')
      .send({ nome: 'ana', email: 'a@a.com' });

    expect(resposta.status).toBe(400);
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna token ao logar com senha certa', async () => {
    const bcrypt = require('bcrypt');
    // precisamos de um hash real para o bcrypt.compare funcionar
    const senha_hash = await bcrypt.hash('123456', 10);
    usuarioModel.buscarPorEmail.mockResolvedValue({
      id_usuario: 1, nome: 'ana', email: 'a@a.com', senha_hash: senha_hash
    });
    usuarioModel.atualizarUltimoAcesso.mockResolvedValue();

    const resposta = await request(app)
      .post('/auth/login')
      .send({ email: 'a@a.com', senha: '123456' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.token).toBeDefined();
  });
});

describe('GET /auth/perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/auth/perfil');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 e os dados com token valido', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({
      id_usuario: 1, nome: 'ana', email: 'a@a.com',
      nivel_dificuldade: 'F', id_liga: 1, dias_consecutivos: 0
    });
    usuarioModel.buscarEstatisticas.mockResolvedValue({
      desafios_concluidos: 0, pontos_totais: 0, media_pontos: null
    });
    const token = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

    const resposta = await request(app)
      .get('/auth/perfil')
      .set('Authorization', 'Bearer ' + token);

    expect(resposta.status).toBe(200);
    expect(resposta.body.id_usuario).toBe(1);
  });

  test('retorna pontuacao_total no perfil', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({
      id_usuario: 1, nome: 'ana', email: 'a@a.com',
      nivel_dificuldade: 'F', id_liga: 2, dias_consecutivos: 3
    });
    usuarioModel.buscarEstatisticas.mockResolvedValue({
      desafios_concluidos: 2, pontos_totais: 500, media_pontos: '250.00'
    });
    const token = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

    const resposta = await request(app)
      .get('/auth/perfil')
      .set('Authorization', 'Bearer ' + token);

    expect(resposta.status).toBe(200);
    expect(resposta.body.pontuacao_total).toBe(500);
    expect(resposta.body.desafios_concluidos).toBe(2);
  });
});
