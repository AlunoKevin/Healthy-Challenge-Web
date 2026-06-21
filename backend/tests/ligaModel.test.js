const ligaModel = require('../src/models/ligaModel');
const pool = require('../src/config/conexao');

jest.mock('../src/config/conexao', () => ({ query: jest.fn() }));

describe('ligaModel.listar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna lista de ligas', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' }] });
    const resultado = await ligaModel.listar();
    expect(resultado).toHaveLength(1);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('retorna array vazio quando nao ha ligas', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await ligaModel.listar();
    expect(resultado).toEqual([]);
  });
});

describe('ligaModel.buscarDoUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna a liga do usuario quando encontrada', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' }] });
    const resultado = await ligaModel.buscarDoUsuario(1);
    expect(resultado.nome).toBe('Bronze');
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('retorna undefined quando usuario nao tem liga', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await ligaModel.buscarDoUsuario(99);
    expect(resultado).toBeUndefined();
  });
});

describe('ligaModel.atualizarLiga', () => {
  beforeEach(() => jest.clearAllMocks());

  test('atribui liga Bronze quando pontuacao e 0', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 1 }] });
    const resultado = await ligaModel.atualizarLiga(1, 0);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
    expect(resultado).toEqual({ id_usuario: 1, id_liga: 1 });
  });

  test('atribui liga Bronze quando pontuacao e 499', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 1 }] });
    await ligaModel.atualizarLiga(1, 499);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
  });

  test('atribui liga Silver quando pontuacao e 500', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 2 }] });
    await ligaModel.atualizarLiga(1, 500);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 2]);
  });

  test('atribui liga Gold quando pontuacao e 1500', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 3 }] });
    await ligaModel.atualizarLiga(1, 1500);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 3]);
  });

  test('atribui liga Platinum quando pontuacao e 3000', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 4 }] });
    await ligaModel.atualizarLiga(1, 3000);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 4]);
  });

  test('atribui liga Diamond quando pontuacao e 6000', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 5 }] });
    await ligaModel.atualizarLiga(1, 6000);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 5]);
  });

  test('atribui liga Master quando pontuacao e 10000', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 6 }] });
    await ligaModel.atualizarLiga(1, 10000);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 6]);
  });

  test('atribui liga Grandmaster quando pontuacao e 15000', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 7 }] });
    await ligaModel.atualizarLiga(1, 15000);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 7]);
  });

  test('atribui liga Challenger quando pontuacao e 25000', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_liga: 8 }] });
    await ligaModel.atualizarLiga(1, 25000);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 8]);
  });

  test('retorna id_usuario e id_liga apos atualizar', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 5, id_liga: 3 }] });
    const resultado = await ligaModel.atualizarLiga(5, 2000);
    expect(resultado).toHaveProperty('id_usuario', 5);
    expect(resultado).toHaveProperty('id_liga', 3);
  });
});
