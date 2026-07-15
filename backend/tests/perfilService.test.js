const perfilService = require('../src/services/perfilService');
const perfilModel = require('../src/models/perfilModel');

jest.mock('../src/models/perfilModel');

describe('perfilService.buscarPerfil', () => {

  test('retorna perfil completo com grupos e amigos', async () => {

    perfilModel.buscarPerfil.mockResolvedValue({
      id_usuario: 1,
      nome: 'Kevin',
      email: 'kevin@test.com',
      pontos_totais: 500
    });

    perfilModel.buscarGrupos.mockResolvedValue([
      {
        id_grupo: 1,
        nome: 'Academia',
        descricao: 'Grupo da academia'
      }
    ]);

    perfilModel.buscarAmigos.mockResolvedValue([
      {
        id_usuario: 2,
        nome: 'Joao',
        email: 'joao@test.com'
      }
    ]);

    const resultado = await perfilService.buscarPerfil(1);

    expect(perfilModel.buscarPerfil)
      .toHaveBeenCalledWith(1);

    expect(perfilModel.buscarGrupos)
      .toHaveBeenCalledWith(1);

    expect(perfilModel.buscarAmigos)
      .toHaveBeenCalledWith(1);

    expect(resultado).toEqual({
      id_usuario: 1,
      nome: 'Kevin',
      email: 'kevin@test.com',
      pontos_totais: 500,

      grupos: [
        {
          id_grupo: 1,
          nome: 'Academia',
          descricao: 'Grupo da academia'
        }
      ],

      amigos: [
        {
          id_usuario: 2,
          nome: 'Joao',
          email: 'joao@test.com'
        }
      ]
    });
  });

  test('lanca erro 404 quando usuario nao existe', async () => {

    perfilModel.buscarPerfil.mockResolvedValue(undefined);

    await expect(
      perfilService.buscarPerfil(999)
    ).rejects.toMatchObject({
      status: 404,
      message: 'usuario nao encontrado'
    });

    expect(perfilModel.buscarGrupos)
      .not.toHaveBeenCalled();

    expect(perfilModel.buscarAmigos)
      .not.toHaveBeenCalled();
  });

});