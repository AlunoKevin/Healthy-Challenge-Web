process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const amizadeService = require('../src/services/amizadeService');

jest.mock('../src/services/amizadeService');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

beforeEach(() => jest.clearAllMocks());

describe('GET /amizades/buscar', () => {
  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/amizades/buscar?q=joao');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com os usuarios encontrados', async () => {
    amizadeService.buscarUsuarios.mockResolvedValue([{ id_usuario: 2, nome: 'Joao', relacionamento: 'NENHUMA' }]);

    const resposta = await request(app)
      .get('/amizades/buscar?q=joao')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(amizadeService.buscarUsuarios).toHaveBeenCalledWith('joao', 1);
    expect(resposta.body).toHaveLength(1);
  });
});

describe('GET /amizades/pendentes', () => {
  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/amizades/pendentes');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com os pedidos pendentes', async () => {
    amizadeService.listarPendentes.mockResolvedValue([{ id_usuario: 3, nome: 'Maria' }]);

    const resposta = await request(app)
      .get('/amizades/pendentes')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });
});

describe('POST /amizades', () => {
  test('retorna 401 sem token', async () => {
    const resposta = await request(app).post('/amizades').send({ id_usuario_destino: 2 });
    expect(resposta.status).toBe(401);
  });

  test('retorna 201 ao criar a solicitacao', async () => {
    amizadeService.solicitarAmizade.mockResolvedValue({ status: 'PENDENTE' });

    const resposta = await request(app)
      .post('/amizades')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ id_usuario_destino: 2 });

    expect(resposta.status).toBe(201);
    expect(amizadeService.solicitarAmizade).toHaveBeenCalledWith(1, 2);
  });

  test('retorna 409 quando ja existe solicitacao pendente', async () => {
    const erro = new Error('já existe uma solicitação pendente entre vocês');
    erro.status = 409;
    amizadeService.solicitarAmizade.mockRejectedValue(erro);

    const resposta = await request(app)
      .post('/amizades')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ id_usuario_destino: 2 });

    expect(resposta.status).toBe(409);
  });
});

describe('PUT /amizades/:idOrigem/aceitar', () => {
  test('retorna 200 ao aceitar', async () => {
    amizadeService.aceitarAmizade.mockResolvedValue({ status: 'ACEITA' });

    const resposta = await request(app)
      .put('/amizades/2/aceitar')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(amizadeService.aceitarAmizade).toHaveBeenCalledWith(1, '2');
  });
});

describe('PUT /amizades/:idOrigem/rejeitar', () => {
  test('retorna 200 ao rejeitar', async () => {
    amizadeService.rejeitarAmizade.mockResolvedValue({ status: 'REJEITADA' });

    const resposta = await request(app)
      .put('/amizades/2/rejeitar')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(amizadeService.rejeitarAmizade).toHaveBeenCalledWith(1, '2');
  });
});
