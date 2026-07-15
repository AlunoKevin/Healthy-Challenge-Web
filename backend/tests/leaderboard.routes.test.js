process.env.JWT_SECRET = 'segredo_teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const leaderboardModel = require('../src/models/leaderboard');

jest.mock('../src/models/leaderboard');

const tokenValido = jwt.sign({ id_usuario: 1, email: 'a@a.com' }, 'segredo_teste');

describe('GET /leaderboard/global', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sem query chama o model sem filtros', async () => {
    leaderboardModel.buscarLeaderboardGlobal.mockResolvedValue([]);

    const resposta = await request(app).get('/leaderboard/global');

    expect(resposta.status).toBe(200);
    expect(leaderboardModel.buscarLeaderboardGlobal).toHaveBeenCalledWith({});
  });

  test('repassa paginacao, liga e periodo ao model', async () => {
    leaderboardModel.buscarLeaderboardGlobal.mockResolvedValue([]);

    await request(app).get('/leaderboard/global?limit=10&offset=5&liga=3&inicio=2026-01-01&fim=2026-12-31');

    expect(leaderboardModel.buscarLeaderboardGlobal).toHaveBeenCalledWith({
      limite: 10,
      deslocamento: 5,
      idLiga: 3,
      dataInicio: '2026-01-01',
      dataFim: '2026-12-31'
    });
  });

  test('ignora query params invalidos', async () => {
    leaderboardModel.buscarLeaderboardGlobal.mockResolvedValue([]);

    await request(app).get('/leaderboard/global?limit=abc&offset=-1');

    expect(leaderboardModel.buscarLeaderboardGlobal).toHaveBeenCalledWith({});
  });
});

describe('GET /leaderboard/amigos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 401 sem token', async () => {
    const resposta = await request(app).get('/leaderboard/amigos');
    expect(resposta.status).toBe(401);
  });

  test('retorna o ranking de amigos do usuario autenticado', async () => {
    leaderboardModel.buscarLeaderboardAmigos.mockResolvedValue([
      { id_usuario: 1, nome: 'Eu', pontuacao_total: 500, posicao: 1 }
    ]);

    const resposta = await request(app)
      .get('/leaderboard/amigos')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(leaderboardModel.buscarLeaderboardAmigos).toHaveBeenCalledWith(1);
    expect(resposta.body).toHaveLength(1);
  });

  test('retorna array vazio quando o usuario nao tem amigos', async () => {
    leaderboardModel.buscarLeaderboardAmigos.mockResolvedValue([]);

    const resposta = await request(app)
      .get('/leaderboard/amigos')
      .set('Authorization', 'Bearer ' + tokenValido);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual([]);
  });
});
