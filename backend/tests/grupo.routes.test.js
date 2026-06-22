process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const grupoService = require('../src/services/grupoService');

jest.mock('../src/services/grupoService');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('POST /grupos', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 201 com grupo criado', async () => {
    grupoService.criar.mockResolvedValue({ id_grupo: 1, nome: 'Turma A', descricao: null });
    const resp = await request(app)
      .post('/grupos')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ nome: 'Turma A' });
    expect(resp.status).toBe(201);
    expect(resp.body.id_grupo).toBe(1);
    expect(resp.body.nome).toBe('Turma A');
  });

  test('retorna 400 quando nome nao e enviado', async () => {
    grupoService.criar.mockRejectedValue(Object.assign(new Error('nome e obrigatorio'), { status: 400 }));
    const resp = await request(app)
      .post('/grupos')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({});
    expect(resp.status).toBe(400);
    expect(resp.body.erro).toBe('nome e obrigatorio');
  });

  test('retorna 401 sem token', async () => {
    const resp = await request(app).post('/grupos').send({ nome: 'X' });
    expect(resp.status).toBe(401);
  });
});

describe('POST /grupos/:id/membros', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 201 ao adicionar membro', async () => {
    grupoService.adicionarMembro.mockResolvedValue();
    const resp = await request(app)
      .post('/grupos/3/membros')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ id_usuario: 5 });
    expect(resp.status).toBe(201);
    expect(resp.body.ok).toBe(true);
  });

  test('retorna 400 quando id_usuario nao e enviado', async () => {
    const resp = await request(app)
      .post('/grupos/3/membros')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({});
    expect(resp.status).toBe(400);
  });

  test('retorna 404 quando grupo nao existe', async () => {
    grupoService.adicionarMembro.mockRejectedValue(
      Object.assign(new Error('grupo nao encontrado'), { status: 404 })
    );
    const resp = await request(app)
      .post('/grupos/99/membros')
      .set('Authorization', 'Bearer ' + tokenValido)
      .send({ id_usuario: 5 });
    expect(resp.status).toBe(404);
  });

  test('retorna 401 sem token', async () => {
    const resp = await request(app).post('/grupos/3/membros').send({ id_usuario: 5 });
    expect(resp.status).toBe(401);
  });
});

describe('DELETE /grupos/:id/membros/:userId', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 200 ao remover membro', async () => {
    grupoService.removerMembro.mockResolvedValue();
    const resp = await request(app)
      .delete('/grupos/3/membros/1')
      .set('Authorization', 'Bearer ' + tokenValido);
    expect(resp.status).toBe(200);
    expect(resp.body.ok).toBe(true);
  });

  test('retorna 403 ao tentar remover outro usuario', async () => {
    grupoService.removerMembro.mockRejectedValue(
      Object.assign(new Error('sem permissao para remover outro usuario'), { status: 403 })
    );
    const resp = await request(app)
      .delete('/grupos/3/membros/7')
      .set('Authorization', 'Bearer ' + tokenValido);
    expect(resp.status).toBe(403);
  });

  test('retorna 404 quando membro nao existe no grupo', async () => {
    grupoService.removerMembro.mockRejectedValue(
      Object.assign(new Error('usuario nao e membro do grupo'), { status: 404 })
    );
    const resp = await request(app)
      .delete('/grupos/3/membros/1')
      .set('Authorization', 'Bearer ' + tokenValido);
    expect(resp.status).toBe(404);
  });

  test('retorna 401 sem token', async () => {
    const resp = await request(app).delete('/grupos/3/membros/1');
    expect(resp.status).toBe(401);
  });
});
