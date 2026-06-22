process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const leaderboardModel = require('../src/models/leaderboard');
const ligaModel = require('../src/models/ligaModel');

jest.mock('../src/models/leaderboard');
jest.mock('../src/models/ligaModel');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('GET /usuario/ranking-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/usuario/ranking-info');
    expect(resposta.status).toBe(401);
  });

  test('retorna 200 com posicao, pontuacao e liga', async () => {
    leaderboardModel.buscarPosicaoDoUsuario.mockResolvedValue({ posicao: 2, pontuacao_total: 4000 });
    ligaModel.buscarDoUsuario.mockResolvedValue({ id_liga: 4, nome: 'Platinum', descricao: 'Liga platina' });

    const resposta = await request(app)
      .get('/usuario/ranking-info')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body.posicao).toBe(2);
    expect(resposta.body.pontuacao_total).toBe(4000);
    expect(resposta.body.liga.nome).toBe('Platinum');
  });
});
