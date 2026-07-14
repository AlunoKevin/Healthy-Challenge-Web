const usuarioService = require('../src/services/usuarioService');
const leaderboardModel = require('../src/models/leaderboard');
const ligaModel = require('../src/models/ligaModel');

jest.mock('../src/models/leaderboard');
jest.mock('../src/models/ligaModel');

describe('usuarioService.rankingInfo', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna posicao, pontuacao_total e liga do usuario', async () => {
    leaderboardModel.buscarPosicaoDoUsuario.mockResolvedValue({ posicao: 3, pontuacao_total: 1800 });
    ligaModel.buscarDoUsuario.mockResolvedValue({ id_liga: 3, nome: 'Gold', descricao: 'Liga ouro' });

    const resultado = await usuarioService.rankingInfo(1);

    expect(leaderboardModel.buscarPosicaoDoUsuario).toHaveBeenCalledWith(1);
    expect(ligaModel.buscarDoUsuario).toHaveBeenCalledWith(1);
    expect(resultado).toEqual({
      posicao: 3,
      pontuacao_total: 1800,
      liga: { id_liga: 3, nome: 'Gold', descricao: 'Liga ouro' }
    });
  });

  test('lanca erro 404 quando usuario nao esta no ranking', async () => {
    leaderboardModel.buscarPosicaoDoUsuario.mockResolvedValue(null);

    await expect(usuarioService.rankingInfo(99)).rejects.toMatchObject({ status: 404 });
  });
});
