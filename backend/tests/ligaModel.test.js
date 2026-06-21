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
