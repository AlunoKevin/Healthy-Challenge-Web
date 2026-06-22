const leaderboardModel = require('../src/models/leaderboard');
const pool = require('../src/config/conexao');

jest.mock('../src/config/conexao', () => ({ query: jest.fn() }));

describe('leaderboardModel.buscarLeaderboardGlobal - pontuacao', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna pontuacao_total no registro do leaderboard global', async () => {
    pool.query.mockResolvedValue({
      rows: [{ posicao: 1, id_usuario: 1, nome: 'Ana', pontuacao_total: 3200 }]
    });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal();
    expect(resultado[0]).toHaveProperty('pontuacao_total', 3200);
  });

  test('pontuacao_total e um numero', async () => {
    pool.query.mockResolvedValue({
      rows: [{ posicao: 1, id_usuario: 1, nome: 'Ana', pontuacao_total: 500 }]
    });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal();
    expect(typeof resultado[0].pontuacao_total).toBe('number');
  });
});

describe('leaderboardModel.buscarLeaderboardGlobal', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna array com posicao, id_usuario, nome, pontuacao_total', async () => {
    const mockRows = [
      { posicao: 1, id_usuario: 2, nome: 'Bia',    pontuacao_total: 8000 },
      { posicao: 2, id_usuario: 5, nome: 'Carlos', pontuacao_total: 4000 },
    ];
    pool.query.mockResolvedValue({ rows: mockRows });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal();
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toMatchObject({ posicao: 1, nome: 'Bia', pontuacao_total: 8000 });
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('retorna array vazio quando nao ha dados', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal();
    expect(resultado).toEqual([]);
  });

  test('ordena pelo campo posicao crescente', async () => {
    const mockRows = [
      { posicao: 1, id_usuario: 1, nome: 'X', pontuacao_total: 100 },
      { posicao: 2, id_usuario: 2, nome: 'Y', pontuacao_total: 50  },
    ];
    pool.query.mockResolvedValue({ rows: mockRows });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal();
    expect(resultado[0].posicao).toBeLessThan(resultado[1].posicao);
  });
});

describe('buscarLeaderboardGlobal - paginacao', () => {
  beforeEach(() => jest.clearAllMocks());

  test('passa limite e deslocamento como parametros', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ limite: 10, deslocamento: 20 });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [10, 20]);
  });

  test('usa limite 20 e deslocamento 0 por padrao', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({});
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [20, 0]);
  });
});

describe('buscarLeaderboardGlobal - filtro liga', () => {
  beforeEach(() => jest.clearAllMocks());

  test('passa id_liga como parametro quando fornecido', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ idLiga: 3 });
    const chamada = pool.query.mock.calls[0];
    expect(chamada[1]).toContain(3);
  });

  test('retorna array vazio quando liga nao tem usuarios', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await leaderboardModel.buscarLeaderboardGlobal({ idLiga: 99 });
    expect(resultado).toEqual([]);
  });
});

describe('buscarLeaderboardGlobal - filtro periodo', () => {
  beforeEach(() => jest.clearAllMocks());

  test('passa data_inicio e data_fim como parametros', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ dataInicio: '2026-01-01', dataFim: '2026-06-30' });
    const chamada = pool.query.mock.calls[0];
    expect(chamada[1]).toContain('2026-01-01');
    expect(chamada[1]).toContain('2026-06-30');
  });

  test('passa apenas data_inicio quando data_fim nao fornecida', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ dataInicio: '2026-01-01' });
    const chamada = pool.query.mock.calls[0];
    expect(chamada[1]).toContain('2026-01-01');
  });
});

describe('leaderboardModel.buscarLeaderboardGrupo', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna array com posicao_grupo, id_usuario, usuario, pontuacao_total', async () => {
    pool.query.mockResolvedValue({
      rows: [{ posicao_grupo: 1, id_usuario: 3, usuario: 'Dani', pontuacao_total: 1200 }]
    });
    const resultado = await leaderboardModel.buscarLeaderboardGrupo(10);
    expect(resultado[0]).toMatchObject({
      posicao_grupo: 1, id_usuario: 3, usuario: 'Dani', pontuacao_total: 1200
    });
  });

  test('passa id_grupo como parametro da query', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGrupo(42);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [42]);
  });

  test('retorna array vazio quando grupo nao tem dados', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await leaderboardModel.buscarLeaderboardGrupo(99);
    expect(resultado).toEqual([]);
  });

  test('filtra corretamente por id_grupo diferente', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGrupo(7);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [7]);
    expect(pool.query).not.toHaveBeenCalledWith(expect.any(String), [42]);
  });
});
