process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const desafioModel = require('../src/models/desafioModel');

jest.mock('../src/models/desafioModel');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('GET /desafios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 com lista de desafios', async () => {
    desafioModel.listarAtivos.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua', pontuacao_prevista: 100 }
    ]);

    const resposta = await request(app).get('/desafios');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });
});

describe('GET /desafios/meus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/desafios/meus');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com token valido', async () => {
    desafioModel.buscarDoUsuario.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua' }
    ]);

    const resposta = await request(app)
      .get('/desafios/meus')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });
});

describe('POST /desafios/:id/inscrever', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).post('/desafios/1/inscrever');
    expect(resposta.status).toBe(401);
  });

  test('retorna 201 ao inscrever com token valido', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(false);
    desafioModel.inscrever.mockResolvedValue({ id_usuario: 1, id_desafio: 1 });

    const resposta = await request(app)
      .post('/desafios/1/inscrever')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(201);
  });

  test('retorna 409 quando ja inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(true);

    const resposta = await request(app)
      .post('/desafios/1/inscrever')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(409);
  });

  test('retorna 404 quando desafio nao existe', async () => {
    desafioModel.buscarPorId.mockResolvedValue(null);

    const resposta = await request(app)
      .post('/desafios/99/inscrever')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(404);
  });
});

describe('POST /desafios/:id/concluir', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).post('/desafios/1/concluir');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 ao concluir com token valido', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200 });
    desafioModel.jaInscrito.mockResolvedValue(true);
    desafioModel.jaConcluiu.mockResolvedValue(false);
    desafioModel.concluir.mockResolvedValue({ id_conclusao: 1, pontuacao: 200 });

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body.pontuacao).toBe(200);
  });

  test('retorna 409 quando ja concluiu', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200 });
    desafioModel.jaInscrito.mockResolvedValue(true);
    desafioModel.jaConcluiu.mockResolvedValue(true);

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(409);
  });

  test('retorna 400 quando nao esta inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200 });
    desafioModel.jaInscrito.mockResolvedValue(false);

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(400);
  });
});
