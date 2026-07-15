process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const desafioModel = require('../src/models/desafioModel');

jest.mock('../src/models/desafioModel');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('GET /historico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/historico');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com o historico de desafios concluidos', async () => {
    desafioModel.buscarConcluidosDoUsuario.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua', pontuacao: 100 }
    ]);

    const resposta = await request(app)
      .get('/historico')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe('Beber agua');
  });
});
