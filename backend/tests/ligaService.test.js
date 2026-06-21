const ligaService = require('../src/services/ligaService');
const ligaModel = require('../src/models/ligaModel');

jest.mock('../src/models/ligaModel');

describe('ligaService.listar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna lista de ligas', async () => {
    ligaModel.listar.mockResolvedValue([
      { id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' },
      { id_liga: 2, nome: 'Silver', descricao: 'Liga intermediaria' }
    ]);

    const resultado = await ligaService.listar();

    expect(resultado).toHaveLength(2);
    expect(ligaModel.listar).toHaveBeenCalled();
  });
});

describe('ligaService.buscarMinhaLiga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna liga do usuario', async () => {
    ligaModel.buscarDoUsuario.mockResolvedValue({ id_liga: 1, nome: 'Bronze', descricao: 'Liga inicial' });

    const resultado = await ligaService.buscarMinhaLiga(1);

    expect(resultado.nome).toBe('Bronze');
    expect(ligaModel.buscarDoUsuario).toHaveBeenCalledWith(1);
  });

  test('lanca 404 quando usuario nao tem liga', async () => {
    ligaModel.buscarDoUsuario.mockResolvedValue(undefined);

    await expect(ligaService.buscarMinhaLiga(99))
      .rejects.toHaveProperty('status', 404);
  });
});
