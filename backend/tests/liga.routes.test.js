process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const ligaModel = require('../src/models/ligaModel');

jest.mock('../src/models/ligaModel');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('GET /ligas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 com lista de ligas', async () => {
    ligaModel.listar.mockResolvedValue([
      { id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' },
      { id_liga: 2, nome: 'Silver', descricao: 'Liga intermediaria' }
    ]);

    const resposta = await request(app).get('/ligas');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(2);
  });
});

describe('GET /ligas/minha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/ligas/minha');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com token valido', async () => {
    ligaModel.buscarDoUsuario.mockResolvedValue({ id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' });

    const resposta = await request(app)
      .get('/ligas/minha')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body.nome).toBe('Bronze');
  });
});
