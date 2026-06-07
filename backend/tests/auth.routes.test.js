const request = require('supertest');
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
