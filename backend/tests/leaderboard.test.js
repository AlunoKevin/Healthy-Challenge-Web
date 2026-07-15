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

describe('leaderboardModel.buscarLeaderboardGlobal - paginacao e filtros', () => {
  beforeEach(() => jest.clearAllMocks());

  test('aplica LIMIT e OFFSET quando informados', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ limite: 10, deslocamento: 20 });
    const [sql, params] = pool.query.mock.calls[0];
    expect(sql).toMatch(/LIMIT/);
    expect(sql).toMatch(/OFFSET/);
    expect(params).toEqual([10, 20]);
  });

  test('filtra por liga usando a tabela Usuario', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ idLiga: 3 });
    const [sql, params] = pool.query.mock.calls[0];
    expect(sql).toMatch(/id_liga/);
    expect(params).toEqual([3]);
  });

  test('filtra por periodo consultando Conclusao_Desafio', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({ dataInicio: '2026-01-01', dataFim: '2026-12-31' });
    const [sql, params] = pool.query.mock.calls[0];
    expect(sql).toMatch(/Conclusao_Desafio/);
    expect(sql).toMatch(/data_conclusao/);
    expect(params).toEqual(['2026-01-01', '2026-12-31']);
  });

  test('combina periodo, liga e paginacao na ordem dos parametros', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await leaderboardModel.buscarLeaderboardGlobal({
      dataInicio: '2026-01-01', dataFim: '2026-12-31', idLiga: 3, limite: 5
    });
    const [, params] = pool.query.mock.calls[0];
    expect(params).toEqual(['2026-01-01', '2026-12-31', 3, 5]);
  });
});

describe('leaderboardModel.buscarPosicaoDoUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('consulta mv_leaderboard_global pelo id e retorna a posicao', async () => {
    pool.query.mockResolvedValue({ rows: [{ posicao: 5, pontuacao_total: 1200 }] });
    const resultado = await leaderboardModel.buscarPosicaoDoUsuario(7);
    expect(pool.query).toHaveBeenCalledWith(expect.stringMatching(/mv_leaderboard_global/), [7]);
    expect(resultado).toEqual({ posicao: 5, pontuacao_total: 1200 });
  });

  test('retorna null quando o usuario nao tem registro', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await leaderboardModel.buscarPosicaoDoUsuario(99);
    expect(resultado).toBeNull();
  });
});

describe('leaderboardModel.buscarLeaderboardAmigos', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna o ranking do usuario com seus amigos', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id_usuario: 1, nome: 'Eu', pontuacao_total: 500, posicao: 1 },
        { id_usuario: 2, nome: 'Amigo', pontuacao_total: 300, posicao: 2 }
      ]
    });

    const resultado = await leaderboardModel.buscarLeaderboardAmigos(1);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('Amizade'), [1]);
    expect(resultado).toHaveLength(2);
  });

  test('retorna array vazio quando o usuario nao tem amigos', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await leaderboardModel.buscarLeaderboardAmigos(1);

    expect(resultado).toEqual([]);
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
