const grupoService = require('../src/services/grupoService');
const grupoModel = require('../src/models/grupoModel');

jest.mock('../src/models/grupoModel');

describe('grupoService.criar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('cria grupo com nome e descricao', async () => {
    grupoModel.criar.mockResolvedValue({ id_grupo: 1, nome: 'Turma A', descricao: 'desc' });
    const resultado = await grupoService.criar('Turma A', 'desc');
    expect(resultado.id_grupo).toBe(1);
    expect(grupoModel.criar).toHaveBeenCalledWith('Turma A', 'desc');
  });

  test('lanca 400 quando nome e vazio', async () => {
    await expect(grupoService.criar('', null)).rejects.toHaveProperty('status', 400);
  });

  test('lanca 400 quando nome e so espacos', async () => {
    await expect(grupoService.criar('   ', null)).rejects.toHaveProperty('status', 400);
  });

  test('lanca 400 quando nome e undefined', async () => {
    await expect(grupoService.criar(undefined, null)).rejects.toHaveProperty('status', 400);
  });

  test('passa descricao como null quando nao fornecida', async () => {
    grupoModel.criar.mockResolvedValue({ id_grupo: 2, nome: 'X', descricao: null });
    await grupoService.criar('X', undefined);
    expect(grupoModel.criar).toHaveBeenCalledWith('X', null);
  });
});

describe('grupoService.adicionarMembro', () => {
  beforeEach(() => jest.clearAllMocks());

  test('adiciona membro quando grupo existe', async () => {
    grupoModel.buscarPorId.mockResolvedValue({ id_grupo: 3, nome: 'G' });
    grupoModel.adicionarMembro.mockResolvedValue();
    await grupoService.adicionarMembro(3, 5);
    expect(grupoModel.adicionarMembro).toHaveBeenCalledWith(3, 5);
  });

  test('lanca 404 quando grupo nao existe', async () => {
    grupoModel.buscarPorId.mockResolvedValue(undefined);
    await expect(grupoService.adicionarMembro(99, 5)).rejects.toHaveProperty('status', 404);
  });
});

describe('grupoService.removerMembro', () => {
  beforeEach(() => jest.clearAllMocks());

  test('lanca 403 quando usuario tenta remover outro', async () => {
    await expect(grupoService.removerMembro(1, 5, 7)).rejects.toHaveProperty('status', 403);
  });

  test('lanca 404 quando grupo nao existe', async () => {
    grupoModel.buscarPorId.mockResolvedValue(undefined);
    await expect(grupoService.removerMembro(99, 5, 5)).rejects.toHaveProperty('status', 404);
  });

  test('lanca 404 quando usuario nao e membro', async () => {
    grupoModel.buscarPorId.mockResolvedValue({ id_grupo: 1 });
    grupoModel.removerMembro.mockResolvedValue(0);
    await expect(grupoService.removerMembro(1, 5, 5)).rejects.toHaveProperty('status', 404);
  });

  test('remove membro com sucesso', async () => {
    grupoModel.buscarPorId.mockResolvedValue({ id_grupo: 1 });
    grupoModel.removerMembro.mockResolvedValue(1);
    await expect(grupoService.removerMembro(1, 5, 5)).resolves.toBeUndefined();
  });
});
