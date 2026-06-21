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

describe('ligaService.atualizarProgressao', () => {
  beforeEach(() => jest.clearAllMocks());

  test('promove usuario para liga superior quando pontuacao sobe', async () => {
    ligaModel.atualizarLiga.mockResolvedValue({ id_usuario: 1, id_liga: 2 });
    const resultado = await ligaService.atualizarProgressao(1, 500);
    expect(ligaModel.atualizarLiga).toHaveBeenCalledWith(1, 500);
    expect(resultado.id_liga).toBe(2);
  });

  test('rebaixa usuario para liga inferior quando pontuacao cai', async () => {
    ligaModel.atualizarLiga.mockResolvedValue({ id_usuario: 1, id_liga: 1 });
    const resultado = await ligaService.atualizarProgressao(1, 100);
    expect(ligaModel.atualizarLiga).toHaveBeenCalledWith(1, 100);
    expect(resultado.id_liga).toBe(1);
  });

  test('retorna objeto com id_usuario e id_liga', async () => {
    ligaModel.atualizarLiga.mockResolvedValue({ id_usuario: 7, id_liga: 4 });
    const resultado = await ligaService.atualizarProgressao(7, 3500);
    expect(resultado).toEqual({ id_usuario: 7, id_liga: 4 });
  });
});
