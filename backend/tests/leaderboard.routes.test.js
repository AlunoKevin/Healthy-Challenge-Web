const request = require('supertest');
const app = require('../src/app');
const leaderboardModel = require('../src/models/leaderboard');

jest.mock('../src/models/leaderboard');

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
