const pool = require('../src/config/conexao');
const usuarioModel = require('../src/models/usuarioModel');

jest.mock('../src/config/conexao');

describe('usuarioModel.buscarEstatisticas', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna estatisticas do usuario com conclusoes', async () => {
    pool.query.mockResolvedValue({
      rows: [{ desafios_concluidos: 3, pontos_totais: 300, media_pontos: '100.00' }]
    });

    const resultado = await usuarioModel.buscarEstatisticas(1);

    expect(resultado.pontos_totais).toBe(300);
    expect(resultado.desafios_concluidos).toBe(3);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('vw_estatisticas_usuario'),
      [1]
    );
  });

  test('retorna zeros quando usuario nao tem conclusoes', async () => {
    pool.query.mockResolvedValue({
      rows: [{ desafios_concluidos: 0, pontos_totais: 0, media_pontos: null }]
    });

    const resultado = await usuarioModel.buscarEstatisticas(1);

    expect(resultado.pontos_totais).toBe(0);
    expect(resultado.desafios_concluidos).toBe(0);
  });
});
