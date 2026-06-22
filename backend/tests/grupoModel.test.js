const grupoModel = require('../src/models/grupoModel');
const pool = require('../src/config/conexao');

jest.mock('../src/config/conexao', () => ({ query: jest.fn() }));

describe('grupoModel.criar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('insere grupo e retorna id_grupo, nome, descricao', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_grupo: 1, nome: 'Turma A', descricao: 'desc' }]
    });
    const resultado = await grupoModel.criar('Turma A', 'desc');
    expect(resultado).toMatchObject({ id_grupo: 1, nome: 'Turma A' });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Grupo'),
      ['Turma A', 'desc']
    );
  });

  test('passa null quando descricao nao e fornecida', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_grupo: 2, nome: 'Sem desc', descricao: null }]
    });
    await grupoModel.criar('Sem desc', null);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['Sem desc', null]);
  });
});

describe('grupoModel.buscarPorId', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna grupo quando encontrado', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_grupo: 5, nome: 'Turma B', descricao: null }]
    });
    const resultado = await grupoModel.buscarPorId(5);
    expect(resultado).toMatchObject({ id_grupo: 5, nome: 'Turma B' });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5]);
  });

  test('retorna undefined quando nao encontrado', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const resultado = await grupoModel.buscarPorId(99);
    expect(resultado).toBeUndefined();
  });
});

describe('grupoModel.adicionarMembro', () => {
  beforeEach(() => jest.clearAllMocks());

  test('chama query com id_usuario e id_grupo', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });
    await grupoModel.adicionarMembro(3, 7);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Usuario_Grupo'),
      [7, 3]
    );
  });
});

describe('grupoModel.removerMembro', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna rowCount ao remover', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });
    const resultado = await grupoModel.removerMembro(3, 7);
    expect(resultado).toBe(1);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM Usuario_Grupo'),
      [7, 3]
    );
  });

  test('retorna 0 quando membro nao existia', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });
    const resultado = await grupoModel.removerMembro(3, 99);
    expect(resultado).toBe(0);
  });
});
