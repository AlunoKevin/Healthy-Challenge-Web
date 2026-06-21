process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const desafioModel = require('../src/models/desafioModel');

jest.mock('../src/models/desafioModel');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');
const tokenAdmin = jwt.sign({ tipo: 'admin', email: 'admin@a.com' }, 'segredo_teste');

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

describe('GET /desafios/concluidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/desafios/concluidos');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com lista de concluidos com token valido', async () => {
    desafioModel.buscarConcluidosDoUsuario.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua', pontuacao: 100 }
    ]);

    const resposta = await request(app)
      .get('/desafios/concluidos')
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
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
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
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(true);
    desafioModel.jaConcluiu.mockResolvedValue(true);

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(409);
  });

  test('retorna 400 quando nao esta inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(false);

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(400);
  });

  test('retorna 400 quando desafio esta inativo', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: false });
    desafioModel.jaInscrito.mockResolvedValue(true);

    const resposta = await request(app)
      .post('/desafios/1/concluir')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(400);
  });
});

describe('POST /desafios', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).post('/desafios').send({ titulo: 'Beber agua', pontuacao_prevista: 100 });
    expect(resposta.status).toBe(401);
  });

  test('retorna 403 com token de usuario comum', async () => {
    const resposta = await request(app)
      .post('/desafios')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ titulo: 'Beber agua', pontuacao_prevista: 100 });
    expect(resposta.status).toBe(403);
  });

  test('retorna 201 ao criar desafio com token admin', async () => {
    desafioModel.criar.mockResolvedValue({ id_desafio: 1, titulo: 'Beber agua', pontuacao_prevista: 100, ativo: true });

    const resposta = await request(app)
      .post('/desafios')
      .set('Authorization', 'Bearer ' + tokenAdmin)
      .send({ titulo: 'Beber agua', pontuacao_prevista: 100 });

    expect(resposta.status).toBe(201);
    expect(resposta.body.titulo).toBe('Beber agua');
  });

  test('retorna 400 quando titulo esta ausente', async () => {
    const resposta = await request(app)
      .post('/desafios')
      .set('Authorization', 'Bearer ' + tokenAdmin)
      .send({ pontuacao_prevista: 100 });
    expect(resposta.status).toBe(400);
  });
});

describe('PUT /desafios/:id', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).put('/desafios/1').send({ titulo: 'Novo', pontuacao_prevista: 200 });
    expect(resposta.status).toBe(401);
  });

  test('retorna 403 com token de usuario comum', async () => {
    const resposta = await request(app)
      .put('/desafios/1')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ titulo: 'Novo', pontuacao_prevista: 200 });
    expect(resposta.status).toBe(403);
  });

  test('retorna 200 ao atualizar com token admin', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1 });
    desafioModel.atualizar.mockResolvedValue({ id_desafio: 1, titulo: 'Novo', pontuacao_prevista: 200 });

    const resposta = await request(app)
      .put('/desafios/1')
      .set('Authorization', 'Bearer ' + tokenAdmin)
      .send({ titulo: 'Novo', pontuacao_prevista: 200 });

    expect(resposta.status).toBe(200);
    expect(resposta.body.titulo).toBe('Novo');
  });

  test('retorna 404 quando desafio nao existe', async () => {
    desafioModel.buscarPorId.mockResolvedValue(null);

    const resposta = await request(app)
      .put('/desafios/99')
      .set('Authorization', 'Bearer ' + tokenAdmin)
      .send({ titulo: 'Novo', pontuacao_prevista: 200 });

    expect(resposta.status).toBe(404);
  });
});

describe('DELETE /desafios/:id', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).delete('/desafios/1');
    expect(resposta.status).toBe(401);
  });

  test('retorna 403 com token de usuario comum', async () => {
    const resposta = await request(app)
      .delete('/desafios/1')
      .set('Authorization', 'Bearer ' + tokenValido);
    expect(resposta.status).toBe(403);
  });

  test('retorna 200 ao inativar com token admin', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1 });
    desafioModel.inativar.mockResolvedValue({ id_desafio: 1, ativo: false });

    const resposta = await request(app)
      .delete('/desafios/1')
      .set('Authorization', 'Bearer ' + tokenAdmin);

    expect(resposta.status).toBe(200);
    expect(resposta.body.ativo).toBe(false);
  });

  test('retorna 404 quando desafio nao existe', async () => {
    desafioModel.buscarPorId.mockResolvedValue(null);

    const resposta = await request(app)
      .delete('/desafios/99')
      .set('Authorization', 'Bearer ' + tokenAdmin);

    expect(resposta.status).toBe(404);
  });
});
